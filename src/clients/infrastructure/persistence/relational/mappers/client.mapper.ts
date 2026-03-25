import { Client } from '../../../../domain/client';
import { ClientEntity } from '../entities/client.entity';

export class ClientMapper {
  static toDomain(raw: ClientEntity): Client {
    const domainEntity = new Client();
    domainEntity.id = raw.id;
    domainEntity.active = raw.active;
    domainEntity.appointmentCount = raw.appointmentCount;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.creditCardsOnFile = raw.creditCardsOnFile;
    domainEntity.currentAccountBalance = raw.currentAccountBalance;
    domainEntity.currentAccountUpdatedAt = raw.currentAccountUpdatedAt;
    domainEntity.custom = raw.custom;
    domainEntity.customFields = raw.customFields;
    domainEntity.keys = raw.keys;
    domainEntity.dob = raw.dob;
    domainEntity.email = raw.email;
    domainEntity.externalId = raw.externalId;
    domainEntity.firstName = raw.firstName;
    domainEntity.hasCardOnFile = raw.hasCardOnFile;
    domainEntity.lastName = raw.lastName;
    domainEntity.marketingSettings = raw.marketingSettings;
    domainEntity.mergedIntoClientId = raw.mergedIntoClientId;
    domainEntity.mobilePhone = raw.mobilePhone;
    domainEntity.name = raw.name;
    domainEntity.notes = raw.notes;
    domainEntity.primaryLocation = raw.primaryLocation;
    domainEntity.pronoun = raw.pronoun;
    domainEntity.reminderSettings = raw.reminderSettings;
    domainEntity.schedulingAlert = raw.schedulingAlert;
    domainEntity.tags = raw.tags;
    domainEntity.updatedAt = raw.updatedAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Client): ClientEntity {
    const persistenceEntity = new ClientEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.active = domainEntity.active;
    persistenceEntity.appointmentCount = domainEntity.appointmentCount;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.creditCardsOnFile = domainEntity.creditCardsOnFile ?? null;
    persistenceEntity.currentAccountBalance = domainEntity.currentAccountBalance;
    persistenceEntity.currentAccountUpdatedAt = domainEntity.currentAccountUpdatedAt ?? null;
    persistenceEntity.custom = domainEntity.custom ?? null;
    persistenceEntity.customFields = domainEntity.customFields ?? null;
    persistenceEntity.keys = domainEntity.keys ?? null;
    persistenceEntity.dob = domainEntity.dob ?? null;
    persistenceEntity.email = domainEntity.email ?? null;
    persistenceEntity.externalId = domainEntity.externalId ?? null;
    persistenceEntity.firstName = domainEntity.firstName ?? null;
    persistenceEntity.hasCardOnFile = domainEntity.hasCardOnFile;
    persistenceEntity.lastName = domainEntity.lastName ?? null;
    persistenceEntity.marketingSettings = domainEntity.marketingSettings ?? null;
    persistenceEntity.mergedIntoClientId = domainEntity.mergedIntoClientId ?? null;
    persistenceEntity.mobilePhone = domainEntity.mobilePhone ?? null;
    persistenceEntity.name = domainEntity.name ?? null;
    persistenceEntity.notes = domainEntity.notes ?? null;
    persistenceEntity.primaryLocation = domainEntity.primaryLocation ?? null;
    persistenceEntity.pronoun = domainEntity.pronoun ?? null;
    persistenceEntity.reminderSettings = domainEntity.reminderSettings ?? null;
    persistenceEntity.schedulingAlert = domainEntity.schedulingAlert ?? null;
    persistenceEntity.tags = domainEntity.tags ?? null;
    persistenceEntity.updatedAt = domainEntity.updatedAt;
    return persistenceEntity;
  }
}
