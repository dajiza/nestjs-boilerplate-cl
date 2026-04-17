import { Module, forwardRef } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { RelationalBookingSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { AppointmentsModule } from '../appointments/appointments.module';
import { ServicesModule } from '../services/services.module';

const infrastructurePersistenceModule = RelationalBookingSessionPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, forwardRef(() => AppointmentsModule), ServicesModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService, infrastructurePersistenceModule],
})
export class BookingModule {}
