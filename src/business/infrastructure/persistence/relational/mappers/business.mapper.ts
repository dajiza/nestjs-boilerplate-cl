import { Business } from '../../../../domain/business';
import { BusinessEntity } from '../entities/business.entity';

export class BusinessMapper {
  static toDomain(raw: BusinessEntity): Business {
    const domainEntity = new Business();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.address = raw.address;
    domainEntity.allowLoginWithMultipleClients = raw.allowLoginWithMultipleClients;
    domainEntity.billingContactEmail = raw.billingContactEmail;
    domainEntity.custom = raw.custom;
    domainEntity.customBookingUrl = raw.customBookingUrl;
    domainEntity.customFields = raw.customFields;
    domainEntity.phone = raw.phone;
    domainEntity.showLocationHours = raw.showLocationHours;
    domainEntity.tz = raw.tz;
    domainEntity.website = raw.website;
    return domainEntity;
  }

  static toPersistence(domainEntity: Business): BusinessEntity {
    const persistenceEntity = new BusinessEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.address = domainEntity.address;
    persistenceEntity.allowLoginWithMultipleClients = domainEntity.allowLoginWithMultipleClients ?? null;
    persistenceEntity.billingContactEmail = domainEntity.billingContactEmail ?? null;
    persistenceEntity.custom = domainEntity.custom;
    persistenceEntity.customBookingUrl = domainEntity.customBookingUrl ?? null;
    persistenceEntity.customFields = domainEntity.customFields;
    persistenceEntity.phone = domainEntity.phone ?? null;
    persistenceEntity.showLocationHours = domainEntity.showLocationHours;
    persistenceEntity.tz = domainEntity.tz;
    persistenceEntity.website = domainEntity.website ?? null;
    return persistenceEntity;
  }
}
