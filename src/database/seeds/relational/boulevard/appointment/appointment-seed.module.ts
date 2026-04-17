import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSeedService } from './appointment-seed.service';
import { AppointmentEntity } from '../../../../../appointments/infrastructure/persistence/relational/entities/appointment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentEntity])],
  providers: [AppointmentSeedService],
  exports: [AppointmentSeedService],
})
export class AppointmentSeedModule {}
