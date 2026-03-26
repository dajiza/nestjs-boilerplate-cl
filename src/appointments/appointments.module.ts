import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { RelationalAppointmentPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { CalComModule } from '../cal-com';
import { ClientsModule } from '../clients/clients.module';

const infrastructurePersistenceModule = RelationalAppointmentPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule, CalComModule, ClientsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService, infrastructurePersistenceModule],
})
export class AppointmentsModule {}
