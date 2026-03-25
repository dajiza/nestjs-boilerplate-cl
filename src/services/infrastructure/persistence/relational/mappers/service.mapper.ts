import { Service } from '../../../../domain/service';
import { ServiceEntity } from '../entities/service.entity';

export class ServiceMapper {
  static toDomain(raw: ServiceEntity): Service {
    const domainEntity = new Service();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.active = raw.active;
    domainEntity.addon = raw.addon;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.defaultDuration = raw.defaultDuration;
    domainEntity.defaultPrice = raw.defaultPrice;
    domainEntity.locationId = raw.locationId;
    domainEntity.categoryId = raw.categoryId;
    domainEntity.custom = raw.custom;
    domainEntity.customFields = raw.customFields;
    domainEntity.keys = raw.keys;
    domainEntity.addons = raw.addons;
    domainEntity.category = raw.category;
    domainEntity.description = raw.description;
    domainEntity.externalId = raw.externalId;
    domainEntity.serviceOptionGroups = raw.serviceOptionGroups;
    domainEntity.serviceOverrides = raw.serviceOverrides;
    domainEntity.serviceStatus = raw.serviceStatus;
    domainEntity.sortPath = raw.sortPath;
    return domainEntity;
  }

  static toPersistence(domainEntity: Service): ServiceEntity {
    const persistenceEntity = new ServiceEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.active = domainEntity.active;
    persistenceEntity.addon = domainEntity.addon;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.defaultDuration = domainEntity.defaultDuration;
    persistenceEntity.defaultPrice = domainEntity.defaultPrice;
    persistenceEntity.locationId = domainEntity.locationId ?? null;
    persistenceEntity.categoryId = domainEntity.categoryId ?? null;
    persistenceEntity.custom = domainEntity.custom ?? null;
    persistenceEntity.customFields = domainEntity.customFields ?? null;
    persistenceEntity.keys = domainEntity.keys ?? null;
    persistenceEntity.addons = domainEntity.addons ?? null;
    persistenceEntity.category = domainEntity.category ?? null;
    persistenceEntity.description = domainEntity.description ?? null;
    persistenceEntity.externalId = domainEntity.externalId ?? null;
    persistenceEntity.serviceOptionGroups = domainEntity.serviceOptionGroups ?? null;
    persistenceEntity.serviceOverrides = domainEntity.serviceOverrides ?? null;
    persistenceEntity.serviceStatus = domainEntity.serviceStatus ?? null;
    persistenceEntity.sortPath = domainEntity.sortPath ?? null;
    return persistenceEntity;
  }
}
