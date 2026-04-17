import { Service } from '../../../../domain/service';
import { ServiceEntity } from '../entities/service.entity';

export class ServiceMapper {
  static toDomain(raw: ServiceEntity): Service {
    const domainEntity = new Service();
    domainEntity.id = raw.id;
    domainEntity.active = raw.active;
    domainEntity.addon = raw.addon;
    domainEntity.addons = raw.addons;
    domainEntity.category = raw.category;
    domainEntity.categoryId = raw.categoryId;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.custom = raw.custom;
    domainEntity.customFields = raw.customFields;
    domainEntity.defaultDuration = raw.defaultDuration;
    domainEntity.defaultPrice = raw.defaultPrice;
    domainEntity.description = raw.description;
    domainEntity.externalId = raw.externalId;
    domainEntity.name = raw.name;
    domainEntity.serviceOptionGroups = raw.serviceOptionGroups;
    domainEntity.serviceOverrides = raw.serviceOverrides;
    domainEntity.serviceStatus = raw.serviceStatus;
    domainEntity.sortPath = raw.sortPath;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Service): ServiceEntity {
    const persistenceEntity = new ServiceEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.active = domainEntity.active;
    persistenceEntity.addon = domainEntity.addon;
    persistenceEntity.addons = domainEntity.addons;
    persistenceEntity.category = domainEntity.category;
    persistenceEntity.categoryId = domainEntity.categoryId;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.custom = domainEntity.custom;
    persistenceEntity.customFields = domainEntity.customFields;
    persistenceEntity.defaultDuration = domainEntity.defaultDuration;
    persistenceEntity.defaultPrice = domainEntity.defaultPrice;
    persistenceEntity.description = domainEntity.description ?? null;
    persistenceEntity.externalId = domainEntity.externalId ?? null;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.serviceOptionGroups = domainEntity.serviceOptionGroups;
    persistenceEntity.serviceOverrides = domainEntity.serviceOverrides;
    persistenceEntity.serviceStatus = domainEntity.serviceStatus;
    persistenceEntity.sortPath = domainEntity.sortPath;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    return persistenceEntity;
  }
}
