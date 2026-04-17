import { Module, forwardRef } from '@nestjs/common';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { ShiftModule } from '../shifts/shift.module';
import { TimeblockModule } from '../timeblocks/timeblock.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { LocationModule } from '../locations/location.module';
import { ServicesModule } from '../services/services.module';
import { StaffModule } from '../staff/staff.module';

@Module({
  imports: [ShiftModule, TimeblockModule, forwardRef(() => AppointmentsModule), LocationModule, ServicesModule, StaffModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
