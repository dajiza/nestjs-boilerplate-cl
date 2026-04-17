import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebhookEventRepository } from '../webhook-event.repository';
import { WebhookEventRelationalRepository } from './repositories/webhook-event.repository';
import { WebhookEventEntity } from './entities/webhook-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WebhookEventEntity])],
  providers: [
    {
      provide: WebhookEventRepository,
      useClass: WebhookEventRelationalRepository,
    },
  ],
  exports: [WebhookEventRepository],
})
export class RelationalWebhookEventPersistenceModule {}
