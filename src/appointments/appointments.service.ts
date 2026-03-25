import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentRepository } from './infrastructure/persistence/appointment.repository';
import { Appointment } from './domain/appointment';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class AppointmentsService {
  constructor(private readonly appointmentsRepository: AppointmentRepository) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsRepository.create({
      id: createAppointmentDto.id,
      startAt: new Date(createAppointmentDto.startAt),
      createdAt: new Date(createAppointmentDto.createdAt),
      cancelled: createAppointmentDto.cancelled,
      staffId: createAppointmentDto.staffId,
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
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Appointment[]; total: number }> {
    return this.appointmentsRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findById(id: Appointment['id']): Promise<NullableType<Appointment>> {
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

  async update(id: Appointment['id'], updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment | null> {
    return this.appointmentsRepository.update(id, updateAppointmentDto);
  }

  async remove(id: Appointment['id']): Promise<void> {
    await this.appointmentsRepository.remove(id);
  }
}
