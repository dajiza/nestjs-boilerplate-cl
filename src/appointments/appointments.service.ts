import { Injectable, Logger } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentRepository } from './infrastructure/persistence/appointment.repository';
import { Appointment } from './domain/appointment';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CalComService } from '../cal-com';
import { ClientsService } from '../clients/clients.service';

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly appointmentsRepository: AppointmentRepository,
    private readonly calComService: CalComService,
    private readonly clientsService: ClientsService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.create({
      startAt: new Date(createAppointmentDto.startAt),
      createdAt: createAppointmentDto.createdAt ? new Date(createAppointmentDto.createdAt) : new Date(),
      cancelled: createAppointmentDto.cancelled,
      staffId: createAppointmentDto.staffId,
      roomId: createAppointmentDto.roomId ?? null,
      equipmentId: createAppointmentDto.equipmentId ?? null,
      appointmentServiceOptions: createAppointmentDto.appointmentServiceOptions ?? null,
      appointmentServiceResources: createAppointmentDto.appointmentServiceResources ?? null,
      appointmentServices: createAppointmentDto.appointmentServices ?? null,
      bookedByType: createAppointmentDto.bookedByType ?? null,
      calendarLinks: createAppointmentDto.calendarLinks ?? null,
      cancellation: createAppointmentDto.cancellation ?? null,
      client: createAppointmentDto.client ?? null,
      clientId: createAppointmentDto.clientId ?? null,
      clientMessage: createAppointmentDto.clientMessage ?? null,
      custom: createAppointmentDto.custom ?? null,
      customFields: createAppointmentDto.customFields ?? null,
      keys: createAppointmentDto.keys ?? null,
      duration: createAppointmentDto.duration ?? null,
      endAt: createAppointmentDto.endAt ? new Date(createAppointmentDto.endAt) : null,
      isGroupedAppointment: createAppointmentDto.isGroupedAppointment ?? null,
      isRecurring: createAppointmentDto.isRecurring ?? null,
      isRemote: createAppointmentDto.isRemote ?? null,
      location: createAppointmentDto.location ?? null,
      locationId: createAppointmentDto.locationId ?? null,
      manageUrl: createAppointmentDto.manageUrl ?? null,
      notes: createAppointmentDto.notes ?? null,
      notifyClientCancel: createAppointmentDto.notifyClientCancel ?? null,
      notifyClientCreate: createAppointmentDto.notifyClientCreate ?? null,
      orderId: createAppointmentDto.orderId ?? null,
      pendingFormCount: createAppointmentDto.pendingFormCount ?? null,
      rating: createAppointmentDto.rating ?? null,
      remotePlatforms: createAppointmentDto.remotePlatforms ?? null,
      state: createAppointmentDto.state ?? null,
      tags: createAppointmentDto.tags ?? null,
    });

    // Sync to Cal.com if appointment has clientId
    if (appointment.clientId) {
      this.syncToCalCom(appointment).catch((error) => {
        this.logger.error(`Failed to sync appointment ${appointment.id} to Cal.com:`, error);
      });
    }

    return appointment;
  }

  private async syncToCalCom(appointment: Appointment): Promise<void> {
    // Fetch client data if not populated
    let client = appointment.client;
    if (!client?.email && appointment.clientId) {
      const clientData = await this.clientsService.findById(appointment.clientId);
      client = clientData;
    }

    if (!client?.email) {
      this.logger.warn(`Appointment ${appointment.id} has no client email, skipping Cal.com sync`);
      return;
    }

    // Calculate end time
    const endAt = appointment.endAt || new Date(appointment.startAt.getTime() + (appointment.duration || 3600) * 1000);

    const booking = await this.calComService.createBooking({
      start: appointment.startAt,
      end: endAt,
      attendee: {
        name: client.name || `${client.firstName || ''} ${client.lastName || ''}`.trim() || 'Unknown',
        email: client.email,
        timeZone: (client as any).timeZone || 'UTC',
      },
      notes: appointment.notes || undefined,
      metadata: {
        appointmentId: appointment.id,
        staffId: appointment.staffId,
      },
    });

    if (booking && appointment.id) {
      await this.appointmentsRepository.update(appointment.id, {
        calComBookingId: booking.uid,
      });
      this.logger.log(`Synced appointment ${appointment.id} to Cal.com booking ${booking.uid}`);
    }
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Appointment[]; total: number }> {
    return this.appointmentsRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findById(id: string): Promise<NullableType<Appointment>> {
    return this.appointmentsRepository.findById(id);
  }

  findByClientId(clientId: Appointment['clientId']): Promise<Appointment[]> {
    return this.appointmentsRepository.findByClientId(clientId);
  }

  findByStaffIdAndDateRange(staffId: Appointment['staffId'], startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByStaffIdAndDateRange({
      staffId,
      startDate,
      endDate,
    });
  }

  findByRoomIdAndDateRange(roomId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByRoomIdAndDateRange({
      roomId,
      startDate,
      endDate,
    });
  }

  findByEquipmentIdAndDateRange(equipmentId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByEquipmentIdAndDateRange({
      equipmentId,
      startDate,
      endDate,
    });
  }

  findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByDateRange({
      startDate,
      endDate,
    });
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment | null> {
    const updated = await this.appointmentsRepository.update(id, updateAppointmentDto);

    // Sync time changes to Cal.com
    if (updated?.calComBookingId && updateAppointmentDto.startAt) {
      this.calComService
        .updateBooking({
          bookingUid: updated.calComBookingId,
          start: new Date(updateAppointmentDto.startAt),
          notes: updateAppointmentDto.notes ?? undefined,
        })
        .catch((error) => {
          this.logger.error(`Failed to update Cal.com booking for appointment ${id}:`, error);
        });
    }

    return updated;
  }

  async remove(id: string): Promise<void> {
    // Get appointment to find cal.com booking ID
    const appointment = await this.appointmentsRepository.findById(id);

    if (appointment?.calComBookingId) {
      await this.calComService.cancelBooking(appointment.calComBookingId);
    }

    await this.appointmentsRepository.remove(id);
  }
}
