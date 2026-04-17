import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('booking_session')
export class BookingSessionEntity {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  locationId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientId: string | null;

  @Column({ type: 'varchar', length: 50 })
  state: string;

  @Column({ type: 'jsonb', nullable: true })
  services: Record<string, any>[] | null;

  @Column({ type: 'timestamp', nullable: true })
  startAt: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'text', nullable: true })
  clientMessage: string | null;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
