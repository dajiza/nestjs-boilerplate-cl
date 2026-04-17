import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import type { BoulevardLocationSummary, StaffSummary } from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'timeblock',
})
export class TimeblockEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'boolean', nullable: true, comment: 'If the timeblock was cancelled' })
  cancelled: boolean | null;

  @Column({ type: 'int', comment: 'The duration of the timeblock' })
  duration: number;

  @Column({ type: 'timestamp', comment: 'End time for the timeblock' })
  endAt: Date;

  @Column({ type: 'jsonb', comment: 'The location associated with the timeblock' })
  location: BoulevardLocationSummary;

  @Column({ type: 'varchar', length: 50, nullable: true, comment: 'The reason for the time being blocked (BUSINESS | PERSONAL)' })
  reason: string | null;

  @Column({ type: 'jsonb', comment: 'The staff whose time is blocked' })
  staff: StaffSummary;

  @Index()
  @Column({ type: 'varchar', length: 255, comment: 'The ID of the staff whose time is blocked' })
  staffId: string;

  @Column({ type: 'timestamp', comment: 'Start time for the timeblock' })
  startAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'The title of the timeblock' })
  title: string | null;
}
