import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
import type { BoulevardLocationSummary, ShiftRecurrence, StaffSummary } from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'shift',
})
export class ShiftEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'boolean', comment: 'Whether the Staff is available or unavailable for this shift' })
  available: boolean;

  @Column({ type: 'date', comment: 'ISO 8601 formatted date of the shift' })
  date: string;

  @Column({ type: 'time', comment: 'ISO 8601 formatted end time of this shift' })
  endTime: string;

  @Column({ type: 'jsonb', comment: 'The Location the shift is scheduled at' })
  location: BoulevardLocationSummary;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'The Id of the Location the shift is scheduled at' })
  locationId: string | null;

  @Column({ type: 'jsonb', nullable: true, comment: 'Recurrence rules of the shift if applicable' })
  recurrence: ShiftRecurrence | null;

  @Column({ type: 'jsonb', comment: 'The Staff the shift is scheduled for' })
  staff: StaffSummary;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'The Id of the Staff the shift is scheduled for' })
  staffId: string | null;

  @Column({ type: 'time', comment: 'ISO 8601 formatted start time of this shift' })
  startTime: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'Reason for being unavailable, if available = false' })
  unavailableReason: string | null;
}
