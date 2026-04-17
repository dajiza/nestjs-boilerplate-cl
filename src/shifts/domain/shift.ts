import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { BoulevardLocationSummary, ShiftRecurrence, StaffSummary } from '../../utils/types/boulevard.types';

export class Shift {
  @ApiProperty({ type: String, description: 'The ID of the shift' })
  id: string;

  @ApiProperty({ type: Boolean, description: 'Whether the Staff is available or unavailable for this shift' })
  available: boolean;

  @ApiProperty({ type: String, description: 'ISO 8601 formatted date of the shift' })
  date: string;

  @ApiProperty({ type: String, description: 'ISO 8601 formatted end time of this shift' })
  endTime: string;

  @ApiProperty({ type: Object, description: 'The Location the shift is scheduled at' })
  location: BoulevardLocationSummary;

  @ApiPropertyOptional({ type: String, description: 'The Id of the Location the shift is scheduled at' })
  locationId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Recurrence rules of the shift if applicable' })
  recurrence?: ShiftRecurrence | null;

  @ApiProperty({ type: Object, description: 'The Staff the shift is scheduled for' })
  staff: StaffSummary;

  @ApiPropertyOptional({ type: String, description: 'The Id of the Staff the shift is scheduled for' })
  staffId?: string | null;

  @ApiProperty({ type: String, description: 'ISO 8601 formatted start time of this shift' })
  startTime: string;

  @ApiPropertyOptional({ type: String, description: 'Reason for being unavailable, if available = false' })
  unavailableReason?: string | null;
}
