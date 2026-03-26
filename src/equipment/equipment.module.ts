import { Module } from '@nestjs/common';
import { EquipmentController } from './equipment.controller';
import { EquipmentService } from './equipment.service';
import { RelationalEquipmentPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

const infrastructurePersistenceModule = RelationalEquipmentPersistenceModule;

@Module({
  imports: [infrastructurePersistenceModule],
  controllers: [EquipmentController],
  providers: [EquipmentService],
  exports: [EquipmentService, infrastructurePersistenceModule],
})
export class EquipmentModule {}
