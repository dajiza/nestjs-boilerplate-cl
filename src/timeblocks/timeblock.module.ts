import { Module } from '@nestjs/common';
import { TimeblockController } from './timeblock.controller';
import { TimeblockService } from './timeblock.service';
import { RelationalTimeblockPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalTimeblockPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [TimeblockController],
  providers: [TimeblockService],
  exports: [TimeblockService, infrastructurePersistenceModule],
})
export class TimeblockModule {}
