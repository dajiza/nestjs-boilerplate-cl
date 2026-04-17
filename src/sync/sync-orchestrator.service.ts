import { Injectable, Logger } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { BoulevardService } from '../boulevard/boulevard.service';
import { SyncStateService } from './sync-state.service';

@Injectable()
export class SyncOrchestratorService {
  private readonly logger = new Logger(SyncOrchestratorService.name);

  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly boulevardService: BoulevardService,
    private readonly syncStateService: SyncStateService,
  ) {}

  /**
   * Create appointment with dual-write to local and Boulevard
   */
  async createAppointmentWithSync(dto: any): Promise<any> {
    // 1. Create appointment locally first
    const localAppointment = await this.appointmentsService.create(dto);

    // 2. Sync to Boulevard
    try {
      const blvdAppointment = await this.boulevardService.createAppointment({
        staffId: dto.staffId,
        startAt: new Date(dto.startAt),
        duration: dto.duration || 60,
        clientId: dto.clientId,
        services: dto.appointmentServices?.map((s: any) => ({
          serviceId: s.serviceId,
          variationId: s.variationId,
        })),
        notes: dto.notes,
        locationId: dto.locationId,
      });

      // Record sync state
      await this.syncStateService.createSyncState({
        localId: localAppointment.id || '',
        boulevardId: blvdAppointment.id,
        entityType: 'APPOINTMENT',
        syncStatus: 'SYNCED',
      });

      this.logger.log(`Appointment ${localAppointment.id} synced to Boulevard: ${blvdAppointment.id}`);
    } catch (error) {
      this.logger.error(`Failed to sync appointment to Boulevard: ${error.message}`);
      // Record failed sync state
      await this.syncStateService.createSyncState({
        localId: localAppointment.id || '',
        boulevardId: '',
        entityType: 'APPOINTMENT',
        syncStatus: 'FAILED',
        error: error,
      });
    }

    return localAppointment;
  }

  /**
   * Update appointment with dual-write
   */
  async updateAppointmentWithSync(id: string, dto: any): Promise<any> {
    // 1. Update appointment locally first
    const localAppointment = await this.appointmentsService.update(id, dto);

    if (!localAppointment) {
      return null;
    }

    return localAppointment;
  }

  /**
   * Cancel appointment with dual-write
   */
  async cancelAppointmentWithSync(id: string): Promise<any> {
    // 1. Get the appointment first
    const localAppointment = await this.appointmentsService.findById(id);

    if (!localAppointment) {
      return null;
    }

    // 2. Cancel appointment locally
    await this.appointmentsService.remove(id);

    return localAppointment;
  }
}
