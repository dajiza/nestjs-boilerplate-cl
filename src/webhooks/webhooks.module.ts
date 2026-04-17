import { Module, OnModuleInit } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';
import { RelationalWebhookEventPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { WebhookHandlerRegistry } from './handlers/webhook-handler.registry';
import { AppointmentWebhookHandler } from './handlers/appointment.handler';
import { AppointmentsModule } from '../appointments/appointments.module';

@Module({
  imports: [HttpModule, RelationalWebhookEventPersistenceModule, AppointmentsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService, WebhookHandlerRegistry, AppointmentWebhookHandler],
  exports: [WebhooksService],
})
export class WebhooksModule implements OnModuleInit {
  constructor(
    private readonly registry: WebhookHandlerRegistry,
    private readonly appointmentHandler: AppointmentWebhookHandler,
  ) {}

  onModuleInit() {
    this.registry.register(this.appointmentHandler);
  }
}
