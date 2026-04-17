import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { WebhookHandlerRegistry } from './handlers/webhook-handler.registry';
import { WebhookEventRepository } from './infrastructure/persistence/webhook-event.repository';
import { WebhookEvent } from './domain/webhook-event';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);
  private readonly webhookSecret: string;

  constructor(
    private readonly handlerRegistry: WebhookHandlerRegistry,
    private readonly configService: ConfigService,
    private readonly webhookEventRepository: WebhookEventRepository,
  ) {
    this.webhookSecret = this.configService.get<string>('BOULEVARD_WEBHOOK_SECRET', { infer: true }) ?? '';
  }

  validateWebhookSignature(body: any, headers: any): boolean {
    if (!this.webhookSecret) {
      return true;
    }

    const signature = headers['x-boulevard-signature'];
    if (!signature) {
      return false;
    }

    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    const expectedSignature = crypto.createHmac('sha256', this.webhookSecret).update(rawBody, 'utf8').digest('hex');

    return signature === expectedSignature;
  }

  async storeWebhookEvent(rawEvent: any): Promise<WebhookEvent> {
    const webhookEvent = new WebhookEvent();
    webhookEvent.id = rawEvent.idempotencyKey;
    webhookEvent.eventType = rawEvent.eventType;
    webhookEvent.resource = rawEvent.resource;
    webhookEvent.event = rawEvent.event;
    webhookEvent.businessId = rawEvent.businessId;
    webhookEvent.webhookId = rawEvent.webhookId;
    webhookEvent.payload = rawEvent;
    webhookEvent.webhookTimestamp = rawEvent.timestamp ? new Date(rawEvent.timestamp) : null;
    webhookEvent.processed = false;

    return this.webhookEventRepository.create(webhookEvent);
  }

  async handleWebhookEvent(event: any): Promise<void> {
    // 1. 存储 raw event
    try {
      await this.storeWebhookEvent(event);
      this.logger.log(`Stored webhook event: ${event.eventType}`);
    } catch (error) {
      // Duplicate key (idempotencyKey) — already processed, skip
      if (error?.code === '23505') {
        this.logger.warn(`Duplicate webhook event ignored: ${event.idempotencyKey}`);
        return;
      }
      this.logger.error('Failed to store webhook event:', error);
    }

    // 2. 通过 Registry 分发到对应 handler
    const { eventType } = event;

    const handler = this.handlerRegistry.getHandler(eventType);
    if (!handler) {
      this.logger.warn(`No handler registered for eventType: ${eventType}`);
      return;
    }

    this.logger.log(`Dispatching ${eventType} to ${handler.constructor.name}`);

    try {
      await handler.handle(eventType, event);

      // 标记为已处理
      // TODO: update webhook_event set processed = true where id = event.idempotencyKey
    } catch (error) {
      this.logger.error(`Handler ${handler.constructor.name} failed for ${eventType}:`, error);
    }
  }

  async findEvents(params: {
    eventType?: string;
    resource?: string;
    processed?: boolean;
    page: number;
    limit: number;
  }): Promise<{ data: WebhookEvent[]; total: number }> {
    return this.webhookEventRepository.findManyWithPagination(params);
  }

  async findEventById(id: string): Promise<WebhookEvent | null> {
    return this.webhookEventRepository.findById(id);
  }
}
