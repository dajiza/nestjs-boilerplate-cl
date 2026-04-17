import { StaffRole } from '../../../../domain/staff-role';
import { StaffRoleEntity } from '../entities/staff-role.entity';

export class StaffRoleMapper {
  static toDomain(raw: StaffRoleEntity): StaffRole {
    const domainEntity = new StaffRole();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    return domainEntity;
  }

  static toPersistence(domainEntity: StaffRole): StaffRoleEntity {
    const persistenceEntity = new StaffRoleEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    return persistenceEntity;
  }
}
