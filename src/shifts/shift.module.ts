import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { RelationalShiftPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalShiftPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [ShiftController],
  providers: [ShiftService],
  exports: [ShiftService, infrastructurePersistenceModule],
})
export class ShiftModule {}
