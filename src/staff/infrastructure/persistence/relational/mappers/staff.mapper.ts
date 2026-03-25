import { Staff } from '../../../../domain/staff';
import { StaffEntity } from '../entities/staff.entity';

export class StaffMapper {
  static toDomain(raw: StaffEntity): Staff {
    const domainEntity = new Staff();
    domainEntity.id = raw.id;
    domainEntity.email = raw.email;
    domainEntity.name = raw.name;
    domainEntity.mobilePhone = raw.mobilePhone;
    domainEntity.active = raw.active;
    domainEntity.displayName = raw.displayName;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.alternateId = raw.alternateId;
    domainEntity.appRole = raw.appRole;
    domainEntity.appRoleId = raw.appRoleId;
    domainEntity.avatar = raw.avatar;
    domainEntity.bio = raw.bio;
    domainEntity.enabledForFutureLocations = raw.enabledForFutureLocations;
    domainEntity.externalId = raw.externalId;
    domainEntity.externalNickname = raw.externalNickname;
    domainEntity.externallyBookable = raw.externallyBookable;
    domainEntity.locationAbilities = raw.locationAbilities;
    domainEntity.locationId = raw.locationId;
    domainEntity.locations = raw.locations;
    domainEntity.nickname = raw.nickname;
    domainEntity.role = raw.role;
    domainEntity.staffRoleId = raw.staffRoleId;
    domainEntity.suspended = raw.suspended;
    return domainEntity;
  }

  static toPersistence(domainEntity: Staff): StaffEntity {
    const persistenceEntity = new StaffEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.mobilePhone = domainEntity.mobilePhone;
    persistenceEntity.active = domainEntity.active;
    persistenceEntity.displayName = domainEntity.displayName ?? null;
    persistenceEntity.firstName = domainEntity.firstName ?? null;
    persistenceEntity.lastName = domainEntity.lastName ?? null;
    persistenceEntity.createdAt = domainEntity.createdAt ?? null;
    persistenceEntity.updatedAt = domainEntity.updatedAt ?? null;
    persistenceEntity.alternateId = domainEntity.alternateId ?? null;
    persistenceEntity.appRole = domainEntity.appRole ?? null;
    persistenceEntity.appRoleId = domainEntity.appRoleId ?? null;
    persistenceEntity.avatar = domainEntity.avatar ?? null;
    persistenceEntity.bio = domainEntity.bio ?? null;
    persistenceEntity.enabledForFutureLocations = domainEntity.enabledForFutureLocations ?? null;
    persistenceEntity.externalId = domainEntity.externalId ?? null;
    persistenceEntity.externalNickname = domainEntity.externalNickname ?? null;
    persistenceEntity.externallyBookable = domainEntity.externallyBookable ?? null;
    persistenceEntity.locationAbilities = domainEntity.locationAbilities ?? null;
    persistenceEntity.locationId = domainEntity.locationId ?? null;
    persistenceEntity.locations = domainEntity.locations ?? null;
    persistenceEntity.nickname = domainEntity.nickname ?? null;
    persistenceEntity.role = domainEntity.role ?? null;
    persistenceEntity.staffRoleId = domainEntity.staffRoleId ?? null;
    persistenceEntity.suspended = domainEntity.suspended ?? null;
    return persistenceEntity;
  }
}
