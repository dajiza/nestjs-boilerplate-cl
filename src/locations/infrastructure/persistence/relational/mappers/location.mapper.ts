import { Location } from '../../../../domain/location';
import { LocationEntity } from '../entities/location.entity';

export class LocationMapper {
  static toDomain(raw: LocationEntity): Location {
    const domainEntity = new Location();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    domainEntity.address = raw.address;
    domainEntity.arrivalInstructions = raw.arrivalInstructions;
    domainEntity.billingContactEmail = raw.billingContactEmail;
    domainEntity.businessName = raw.businessName;
    domainEntity.contactEmail = raw.contactEmail;
    domainEntity.coordinates = raw.coordinates;
    domainEntity.externalId = raw.externalId;
    domainEntity.googlePlaceId = raw.googlePlaceId;
    domainEntity.hours = raw.hours;
    domainEntity.isRemote = raw.isRemote;
    domainEntity.paymentOptions = raw.paymentOptions;
    domainEntity.phone = raw.phone;
    domainEntity.showLocationHours = raw.showLocationHours;
    domainEntity.tz = raw.tz;
    domainEntity.website = raw.website;
    return domainEntity;
  }

  static toPersistence(domainEntity: Location): LocationEntity {
    const persistenceEntity = new LocationEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    persistenceEntity.address = domainEntity.address ?? {};
    persistenceEntity.arrivalInstructions = domainEntity.arrivalInstructions ?? null;
    persistenceEntity.billingContactEmail = domainEntity.billingContactEmail ?? null;
    persistenceEntity.businessName = domainEntity.businessName;
    persistenceEntity.contactEmail = domainEntity.contactEmail ?? null;
    persistenceEntity.coordinates = domainEntity.coordinates ?? null;
    persistenceEntity.externalId = domainEntity.externalId ?? null;
    persistenceEntity.googlePlaceId = domainEntity.googlePlaceId ?? null;
    persistenceEntity.hours = domainEntity.hours ?? null;
    persistenceEntity.isRemote = domainEntity.isRemote;
    persistenceEntity.paymentOptions = domainEntity.paymentOptions ?? [];
    persistenceEntity.phone = domainEntity.phone ?? null;
    persistenceEntity.showLocationHours = domainEntity.showLocationHours;
    persistenceEntity.tz = domainEntity.tz;
    persistenceEntity.website = domainEntity.website ?? null;
    return persistenceEntity;
  }
}
