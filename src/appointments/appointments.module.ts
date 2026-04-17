import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { RelationalAppointmentPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ClientsModule } from '../clients/clients.module';
import { AvailabilityModule } from '../availability/availability.module';
import { BookingModule } from '../booking/booking.module';

const infrastructurePersistenceModule = RelationalAppointmentPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, ClientsModule, forwardRef(() => AvailabilityModule), forwardRef(() => BookingModule)],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService, infrastructurePersistenceModule],
})
export class AppointmentsModule {}
