import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sync_state' })
export class SyncStateEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'local_id', type: 'varchar', length: 255 })
  localId: string;

  @Column({ name: 'boulevard_id', type: 'varchar', length: 255, nullable: true })
  boulevardId: string | null;

  @Column({ name: 'entity_type', type: 'varchar', length: 50 })
  entityType: string;

  @Column({ name: 'sync_status', type: 'varchar', length: 20 })
  syncStatus: 'SYNCED' | 'PENDING' | 'FAILED';

  @Column({ name: 'error', type: 'jsonb', nullable: true })
  error: Record<string, any> | null;

  @Column({ name: 'synced_at', type: 'timestamp', nullable: true })
  syncedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
