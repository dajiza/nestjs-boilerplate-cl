import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sync_audit_log' })
export class SyncAuditLogEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'entity_type', type: 'varchar', length: 50 })
  entityType: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 255 })
  entityId: string;

  @Column({ name: 'operation', type: 'varchar', length: 20 })
  operation: 'CREATE' | 'UPDATE' | 'DELETE';

  @Column({ name: 'source', type: 'varchar', length: 20 })
  source: 'LOCAL' | 'BOULEVARD';

  @Column({ name: 'target', type: 'varchar', length: 20 })
  target: 'LOCAL' | 'BOULEVARD';

  @Column({ name: 'status', type: 'varchar', length: 20 })
  status: 'SUCCESS' | 'FAILED';

  @Column({ name: 'request_payload', type: 'jsonb', nullable: true })
  requestPayload: Record<string, any> | null;

  @Column({ name: 'response_payload', type: 'jsonb', nullable: true })
  responsePayload: Record<string, any> | null;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
