import { ServiceCategory } from '../../../../domain/service-category';
import { ServiceCategoryEntity } from '../entities/service-category.entity';

export class ServiceCategoryMapper {
  static toDomain(raw: ServiceCategoryEntity): ServiceCategory {
    const domainEntity = new ServiceCategory();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.active = raw.active;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.services = raw.services;
    domainEntity.sortPath = raw.sortPath;
    return domainEntity;
  }

  static toPersistence(domainEntity: ServiceCategory): ServiceCategoryEntity {
    const persistenceEntity = new ServiceCategoryEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.active = domainEntity.active;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    persistenceEntity.services = domainEntity.services ?? null;
    persistenceEntity.sortPath = domainEntity.sortPath ?? '';
    return persistenceEntity;
  }
}
