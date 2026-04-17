import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { IncrementalSyncService } from './sync-incremental.service';
import { ClientsModule } from '../clients/clients.module';
import { StaffModule } from '../staff/staff.module';
import { ServicesModule } from '../services/services.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { LocationModule } from '../locations/location.module';
import { ServiceCategoryModule } from '../service-categories/service-category.module';
import { BusinessModule } from '../business/business.module';
import { ShiftModule } from '../shifts/shift.module';
import { TimeblockModule } from '../timeblocks/timeblock.module';
import { StaffRoleModule } from '../staff-roles/staff-role.module';

@Module({
  imports: [
    HttpModule,
    ClientsModule,
    StaffModule,
    ServicesModule,
    AppointmentsModule,
    LocationModule,
    ServiceCategoryModule,
    BusinessModule,
    ShiftModule,
    TimeblockModule,
    StaffRoleModule,
  ],
  providers: [SyncService, IncrementalSyncService],
  controllers: [SyncController],
  exports: [SyncService, IncrementalSyncService],
})
export class SyncModule {}
