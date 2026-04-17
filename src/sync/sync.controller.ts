import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SyncService, SyncResult } from './sync.service';
import { IncrementalSyncService, IncrementalSyncResult } from './sync-incremental.service';

@ApiTags('Sync')
@Controller({
  path: 'sync',
  version: '1',
})
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly incrementalSyncService: IncrementalSyncService,
  ) {}

  @Post('all')
  @HttpCode(HttpStatus.OK)
  async syncAll(): Promise<SyncResult[]> {
    return this.syncService.syncAll();
  }

  @Post('business')
  @HttpCode(HttpStatus.OK)
  async syncBusiness(): Promise<SyncResult> {
    return this.syncService.syncBusiness();
  }

  @Post('locations')
  @HttpCode(HttpStatus.OK)
  async syncLocations(): Promise<SyncResult> {
    return this.syncService.syncLocations();
  }

  @Post('service-categories')
  @HttpCode(HttpStatus.OK)
  async syncServiceCategories(): Promise<SyncResult> {
    return this.syncService.syncServiceCategories();
  }

  @Post('services')
  @HttpCode(HttpStatus.OK)
  async syncServices(): Promise<SyncResult> {
    return this.syncService.syncServices();
  }

  @Post('staff')
  @HttpCode(HttpStatus.OK)
  async syncStaff(): Promise<SyncResult> {
    return this.syncService.syncStaff();
  }

  @Post('clients')
  @HttpCode(HttpStatus.OK)
  async syncClients(): Promise<SyncResult> {
    return this.syncService.syncClients();
  }

  @Post('appointments')
  @HttpCode(HttpStatus.OK)
  async syncAppointments(): Promise<SyncResult> {
    return this.syncService.syncAppointments();
  }

  @Post('shifts')
  @HttpCode(HttpStatus.OK)
  async syncShifts(): Promise<SyncResult> {
    return this.syncService.syncShifts();
  }

  @Post('timeblocks')
  @HttpCode(HttpStatus.OK)
  async syncTimeblocks(): Promise<SyncResult> {
    return this.syncService.syncTimeblocks();
  }

  @Post('staff-roles')
  @HttpCode(HttpStatus.OK)
  async syncStaffRoles(): Promise<SyncResult> {
    return this.syncService.syncStaffRoles();
  }

  @Post('incremental')
  @HttpCode(HttpStatus.OK)
  async incrementalSync(): Promise<IncrementalSyncResult[]> {
    return this.incrementalSyncService.incrementalSyncAll();
  }

  // 增量同步单个实体
  @Post('incremental/business')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncBusiness(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncBusiness();
  }

  @Post('incremental/locations')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncLocations(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncLocations();
  }

  @Post('incremental/service-categories')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncServiceCategories(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncServiceCategories();
  }

  @Post('incremental/services')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncServices(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncServices();
  }

  @Post('incremental/staff')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncStaff(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncStaff();
  }

  @Post('incremental/clients')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncClients(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncClients();
  }

  @Post('incremental/appointments')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncAppointments(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncAppointments();
  }

  @Post('incremental/shifts')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncShifts(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncShifts();
  }

  @Post('incremental/timeblocks')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncTimeblocks(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncTimeblocks();
  }

  @Post('incremental/staff-roles')
  @HttpCode(HttpStatus.OK)
  async incrementalSyncStaffRoles(): Promise<IncrementalSyncResult> {
    return this.incrementalSyncService.incrementalSyncStaffRoles();
  }
}
