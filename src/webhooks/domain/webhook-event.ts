import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WebhookEvent {
  @ApiProperty({ type: String, description: 'Idempotency key (primary key)' })
  id: string;

  @ApiProperty({ type: String, description: 'Event type, e.g. MAILER_APPOINTMENT_CONFIRMATION' })
  eventType: string;

  @ApiPropertyOptional({ type: String, description: 'Resource type, e.g. Appointment' })
  resource?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Event name, e.g. mailer.appointment.confirmation' })
  event?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Business ID' })
  businessId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Webhook configuration ID' })
  webhookId?: string | null;

  @ApiProperty({ type: Object, description: 'Full original webhook payload' })
  payload: Record<string, any>;

  @ApiPropertyOptional({ type: Date, description: 'Webhook trigger timestamp' })
  webhookTimestamp?: Date | null;

  @ApiProperty({ type: Boolean, description: 'Whether the event has been processed' })
  processed: boolean;

  @ApiProperty({ type: Date, description: 'Record creation time' })
  createdAt: Date;
}
