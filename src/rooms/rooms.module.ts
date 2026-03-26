import { Module } from '@nestjs/common';
import { RoomsController } from './rooms.controller';
import { RoomsService } from './rooms.service';
import { RelationalRoomPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalRoomPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService, infrastructurePersistenceModule],
})
export class RoomsModule {}
