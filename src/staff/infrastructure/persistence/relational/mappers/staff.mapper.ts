import { Staff } from '../../../../domain/staff';
import { StaffEntity } from '../entities/staff.entity';

export class StaffMapper {
  static toDomain(raw: StaffEntity): Staff {
    const domainEntity = new Staff();
    domainEntity.id = raw.id;
    domainEntity.active = raw.active;
    domainEntity.alternateId = raw.alternateId;
    domainEntity.appRole = raw.appRole;
    domainEntity.appRoleId = raw.appRoleId;
    domainEntity.avatar = raw.avatar;
    domainEntity.bio = raw.bio;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.displayName = raw.displayName;
    domainEntity.email = raw.email;
    domainEntity.enabledForFutureLocations = raw.enabledForFutureLocations;
    domainEntity.externalId = raw.externalId;
    domainEntity.externalNickname = raw.externalNickname;
    domainEntity.externallyBookable = raw.externallyBookable;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;
    domainEntity.locationAbilities = raw.locationAbilities;
    domainEntity.locations = raw.locations;
    domainEntity.mobilePhone = raw.mobilePhone;
    domainEntity.name = raw.name;
    domainEntity.nickname = raw.nickname;
    domainEntity.role = raw.role;
    domainEntity.staffRoleId = raw.staffRoleId;
    domainEntity.suspended = raw.suspended;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Staff): StaffEntity {
    const persistenceEntity = new StaffEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.active = domainEntity.active ?? null;
    persistenceEntity.alternateId = domainEntity.alternateId ?? null;
    persistenceEntity.appRole = domainEntity.appRole;
    persistenceEntity.appRoleId = domainEntity.appRoleId ?? null;
    persistenceEntity.avatar = domainEntity.avatar ?? null;
    persistenceEntity.bio = domainEntity.bio ?? null;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.displayName = domainEntity.displayName;
    persistenceEntity.email = domainEntity.email ?? null;
    persistenceEntity.enabledForFutureLocations = domainEntity.enabledForFutureLocations;
    persistenceEntity.externalId = domainEntity.externalId ?? null;
    persistenceEntity.externalNickname = domainEntity.externalNickname ?? null;
    persistenceEntity.externallyBookable = domainEntity.externallyBookable ?? null;
    persistenceEntity.firstName = domainEntity.firstName;
    persistenceEntity.lastName = domainEntity.lastName ?? null;
    persistenceEntity.locationAbilities = domainEntity.locationAbilities;
    persistenceEntity.locations = domainEntity.locations ?? null;
    persistenceEntity.mobilePhone = domainEntity.mobilePhone ?? null;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.nickname = domainEntity.nickname ?? null;
    persistenceEntity.role = domainEntity.role;
    persistenceEntity.staffRoleId = domainEntity.staffRoleId;
    persistenceEntity.suspended = domainEntity.suspended ?? null;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    return persistenceEntity;
  }
}
