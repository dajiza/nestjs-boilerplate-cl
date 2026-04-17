import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingSessionEntity } from './entities/booking-session.entity';
import { BookingSessionRepository } from '../booking-session.repository';
import { BookingSessionRelationalRepository } from './repositories/booking-session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BookingSessionEntity])],
  providers: [
    {
      provide: BookingSessionRepository,
      useClass: BookingSessionRelationalRepository,
    },
  ],
  exports: [BookingSessionRepository],
})
export class RelationalBookingSessionPersistenceModule {}
