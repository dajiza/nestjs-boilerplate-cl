import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject, IsBoolean, IsDateString } from 'class-validator';
import type { BoulevardLocationSummary, ShiftRecurrence, StaffSummary } from '../../utils/types/boulevard.types';

export class CreateShiftDto {
  @ApiProperty({ type: String, description: 'The ID of the shift' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ type: Boolean, description: 'Whether the Staff is available or unavailable for this shift' })
  @IsNotEmpty()
  @IsBoolean()
  available: boolean;

  @ApiProperty({ type: String, description: 'ISO 8601 formatted date of the shift' })
  @IsNotEmpty()
  @IsDateString()
  date: string;

  @ApiProperty({ type: String, description: 'ISO 8601 formatted end time of this shift' })
  @IsNotEmpty()
  @IsString()
  endTime: string;

  @ApiProperty({ type: Object, description: 'The Location the shift is scheduled at' })
  @IsNotEmpty()
  @IsObject()
  location: BoulevardLocationSummary;

  @ApiPropertyOptional({ type: String, description: 'The Id of the Location the shift is scheduled at' })
  @IsOptional()
  @IsString()
  locationId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Recurrence rules of the shift if applicable' })
  @IsOptional()
  @IsObject()
  recurrence?: ShiftRecurrence | null;

  @ApiProperty({ type: Object, description: 'The Staff the shift is scheduled for' })
  @IsNotEmpty()
  @IsObject()
  staff: StaffSummary;

  @ApiPropertyOptional({ type: String, description: 'The Id of the Staff the shift is scheduled for' })
  @IsOptional()
  @IsString()
  staffId?: string | null;

  @ApiProperty({ type: String, description: 'ISO 8601 formatted start time of this shift' })
  @IsNotEmpty()
  @IsString()
  startTime: string;

  @ApiPropertyOptional({ type: String, description: 'Reason for being unavailable, if available = false' })
  @IsOptional()
  @IsString()
  unavailableReason?: string | null;
}
