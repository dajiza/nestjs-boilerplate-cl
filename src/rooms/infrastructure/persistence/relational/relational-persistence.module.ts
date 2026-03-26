import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from './entities/room.entity';
import { RoomsRelationalRepository } from './repositories/room.repository';
import { RoomRepository } from '../room.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity])],
  providers: [
    {
      provide: RoomRepository,
      useClass: RoomsRelationalRepository,
    },
  ],
  exports: [RoomRepository],
})
export class RelationalRoomPersistenceModule {}
