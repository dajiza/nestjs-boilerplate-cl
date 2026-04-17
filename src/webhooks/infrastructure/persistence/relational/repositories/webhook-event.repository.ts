import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebhookEventEntity } from '../entities/webhook-event.entity';
import { WebhookEvent } from '../../../../domain/webhook-event';
import { WebhookEventRepository } from '../../webhook-event.repository';
import { WebhookEventMapper } from '../mappers/webhook-event.mapper';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class WebhookEventRelationalRepository implements WebhookEventRepository {
  constructor(
    @InjectRepository(WebhookEventEntity)
    private readonly repository: Repository<WebhookEventEntity>,
  ) {}

  async create(data: WebhookEvent): Promise<WebhookEvent> {
    const persistenceModel = WebhookEventMapper.toPersistence(data);
    const newEntity = await this.repository.save(this.repository.create(persistenceModel));
    return WebhookEventMapper.toDomain(newEntity);
  }

  async findById(id: string): Promise<NullableType<WebhookEvent>> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? WebhookEventMapper.toDomain(entity) : null;
  }

  async findManyWithPagination(params: {
    eventType?: string;
    resource?: string;
    processed?: boolean;
    page: number;
    limit: number;
  }): Promise<{ data: WebhookEvent[]; total: number }> {
    const queryBuilder = this.repository.createQueryBuilder('webhook_event');

    if (params.eventType) {
      queryBuilder.andWhere('webhook_event.eventType = :eventType', {
        eventType: params.eventType,
      });
    }

    if (params.resource) {
      queryBuilder.andWhere('webhook_event.resource = :resource', {
        resource: params.resource,
      });
    }

    if (params.processed !== undefined) {
      queryBuilder.andWhere('webhook_event.processed = :processed', {
        processed: params.processed,
      });
    }

    queryBuilder
      .orderBy('webhook_event.createdAt', 'DESC')
      .skip((params.page - 1) * params.limit)
      .take(params.limit);

    const [entities, total] = await queryBuilder.getManyAndCount();

    return {
      data: entities.map((entity) => WebhookEventMapper.toDomain(entity)),
      total,
    };
  }
}
