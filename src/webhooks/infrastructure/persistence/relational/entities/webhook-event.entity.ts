import { Column, Entity, Index, PrimaryColumn, CreateDateColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'webhook_event',
})
export class WebhookEventEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'Idempotency key' })
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255, comment: 'Event type' })
  eventType: string;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Resource type' })
  resource: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Event name' })
  event: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Business ID' })
  businessId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Webhook configuration ID' })
  webhookId: string | null;

  @Column({ type: 'jsonb', comment: 'Full original webhook payload' })
  payload: Record<string, any>;

  @Index()
  @Column({ type: 'timestamp with time zone', nullable: true, comment: 'Webhook trigger timestamp' })
  webhookTimestamp: Date | null;

  @Index()
  @Column({ type: 'boolean', default: false, comment: 'Whether the event has been processed' })
  processed: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
