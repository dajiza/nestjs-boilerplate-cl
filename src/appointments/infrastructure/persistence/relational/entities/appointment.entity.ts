import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

@Entity({
  name: 'appointment',
})
export class AppointmentEntity extends EntityRelationalHelper {
  // ===== 必填字段 =====
  @PrimaryColumn({ type: 'varchar', length: 255 })
  id: string;

  @Index()
  @Column({ type: 'timestamp' })
  startAt: Date;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'boolean' })
  cancelled: boolean;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  staffId: string;

  // ===== 可选字段 =====
  @Column({ type: 'jsonb', nullable: true })
  appointmentServiceOptions: Record<string, any>[] | null;

  @Column({ type: 'jsonb', nullable: true })
  appointmentServiceResources: Record<string, any>[] | null;

  @Column({ type: 'jsonb', nullable: true })
  appointmentServices: Record<string, any>[] | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  bookedByType: string | null;

  @Column({ type: 'jsonb', nullable: true })
  calendarLinks: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  cancellation: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  client: Record<string, any> | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  clientId: string | null;

  @Column({ type: 'text', nullable: true })
  clientMessage: string | null;

  @Column({ type: 'jsonb', nullable: true })
  custom: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  customFields: Record<string, any>[] | null;

  @Column({ type: 'text', array: true, nullable: true })
  keys: string[] | null;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column({ type: 'timestamp', nullable: true })
  endAt: Date | null;

  @Column({ type: 'boolean', nullable: true })
  isGroupedAppointment: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  isRecurring: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  isRemote: boolean | null;

  @Column({ type: 'jsonb', nullable: true })
  location: Record<string, any> | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true })
  locationId: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  manageUrl: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'boolean', nullable: true })
  notifyClientCancel: boolean | null;

  @Column({ type: 'boolean', nullable: true })
  notifyClientCreate: boolean | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  orderId: string | null;

  @Column({ type: 'int', nullable: true })
  pendingFormCount: number | null;

  @Column({ type: 'jsonb', nullable: true })
  rating: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  remotePlatforms: Record<string, any> | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state: string | null;

  @Column({ type: 'jsonb', nullable: true })
  tags: Record<string, any>[] | null;
}
