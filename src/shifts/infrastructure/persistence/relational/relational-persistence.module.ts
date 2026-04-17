import { Module } from '@nestjs/common';
import { ShiftRepository } from '../shift.repository';
import { ShiftRelationalRepository } from './repositories/shift.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShiftEntity } from './entities/shift.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShiftEntity])],
  providers: [
    {
      provide: ShiftRepository,
      useClass: ShiftRelationalRepository,
    },
  ],
  exports: [ShiftRepository],
})
export class RelationalShiftPersistenceModule {}
