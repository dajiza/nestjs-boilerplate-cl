import { WebhookEvent } from '../../../../domain/webhook-event';
import { WebhookEventEntity } from '../entities/webhook-event.entity';

export class WebhookEventMapper {
  static toDomain(raw: WebhookEventEntity): WebhookEvent {
    const domainEntity = new WebhookEvent();
    domainEntity.id = raw.id;
    domainEntity.eventType = raw.eventType;
    domainEntity.resource = raw.resource;
    domainEntity.event = raw.event;
    domainEntity.businessId = raw.businessId;
    domainEntity.webhookId = raw.webhookId;
    domainEntity.payload = raw.payload;
    domainEntity.webhookTimestamp = raw.webhookTimestamp;
    domainEntity.processed = raw.processed;
    domainEntity.createdAt = raw.createdAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: WebhookEvent): WebhookEventEntity {
    const persistenceEntity = new WebhookEventEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.eventType = domainEntity.eventType;
    persistenceEntity.resource = domainEntity.resource ?? null;
    persistenceEntity.event = domainEntity.event ?? null;
    persistenceEntity.businessId = domainEntity.businessId ?? null;
    persistenceEntity.webhookId = domainEntity.webhookId ?? null;
    persistenceEntity.payload = domainEntity.payload;
    persistenceEntity.webhookTimestamp = domainEntity.webhookTimestamp ?? null;
    persistenceEntity.processed = domainEntity.processed;
    return persistenceEntity;
  }
}
