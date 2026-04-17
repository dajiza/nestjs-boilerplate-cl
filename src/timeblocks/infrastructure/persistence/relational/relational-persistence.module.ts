import { Module } from '@nestjs/common';
import { TimeblockRepository } from '../timeblock.repository';
import { TimeblockRelationalRepository } from './repositories/timeblock.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeblockEntity } from './entities/timeblock.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TimeblockEntity])],
  providers: [
    {
      provide: TimeblockRepository,
      useClass: TimeblockRelationalRepository,
    },
  ],
  exports: [TimeblockRepository],
})
export class RelationalTimeblockPersistenceModule {}
