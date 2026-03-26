import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EquipmentEntity } from './entities/equipment.entity';
import { EquipmentRelationalRepository } from './repositories/equipment.repository';
import { EquipmentRepository } from '../equipment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([EquipmentEntity])],
  providers: [
    {
      provide: EquipmentRepository,
      useClass: EquipmentRelationalRepository,
    },
  ],
  exports: [EquipmentRepository],
})
export class RelationalEquipmentPersistenceModule {}
