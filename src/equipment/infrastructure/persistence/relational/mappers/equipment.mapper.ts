import { Equipment } from '../../../../domain/equipment';
import { EquipmentEntity } from '../entities/equipment.entity';

export class EquipmentMapper {
  static toDomain(raw: EquipmentEntity): Equipment {
    const equipment = new Equipment();
    equipment.id = raw.id;
    equipment.name = raw.name;
    equipment.serviceId = raw.serviceId;
    equipment.createdAt = raw.createdAt;
    equipment.updatedAt = raw.updatedAt;
    return equipment;
  }

  static toPersistence(equipment: Equipment): EquipmentEntity {
    const entity = new EquipmentEntity();
    if (equipment.id) {
      entity.id = equipment.id;
    }
    entity.name = equipment.name;
    entity.serviceId = equipment.serviceId;
    entity.createdAt = equipment.createdAt;
    entity.updatedAt = equipment.updatedAt;
    return entity;
  }
}
