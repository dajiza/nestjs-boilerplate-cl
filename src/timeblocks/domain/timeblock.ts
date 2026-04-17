import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { BoulevardLocationSummary, StaffSummary } from '../../utils/types/boulevard.types';

export enum TimeblockReason {
  BUSINESS = 'BUSINESS',
  PERSONAL = 'PERSONAL',
}

export class Timeblock {
  @ApiProperty({ type: String, description: 'The ID of the timeblock' })
  id: string;

  @ApiPropertyOptional({ type: Boolean, description: 'If the timeblock was cancelled' })
  cancelled?: boolean | null;

  @ApiProperty({ type: Number, description: 'The duration of the timeblock' })
  duration: number;

  @ApiProperty({ type: Date, description: 'End time for the timeblock' })
  endAt: Date;

  @ApiProperty({ type: Object, description: 'The location associated with the timeblock' })
  location: BoulevardLocationSummary;

  @ApiPropertyOptional({ enum: TimeblockReason, description: 'The reason for the time being blocked (BUSINESS | PERSONAL)' })
  reason?: TimeblockReason | null;

  @ApiProperty({ type: Object, description: 'The staff whose time is blocked' })
  staff: StaffSummary;

  @ApiProperty({ type: String, description: 'The ID of the staff whose time is blocked' })
  staffId: string;

  @ApiProperty({ type: Date, description: 'Start time for the timeblock' })
  startAt: Date;

  @ApiPropertyOptional({ type: String, description: 'The title of the timeblock' })
  title?: string | null;
}
