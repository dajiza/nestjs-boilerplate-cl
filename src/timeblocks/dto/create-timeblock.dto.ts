import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject, IsDateString, IsBoolean, IsNumber, IsEnum } from 'class-validator';
import { TimeblockReason } from '../domain/timeblock';
import type { BoulevardLocationSummary, StaffSummary } from '../../utils/types/boulevard.types';

export class CreateTimeblockDto {
  @ApiProperty({ type: String, description: 'The ID of the timeblock' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiPropertyOptional({ type: Boolean, description: 'If the timeblock was cancelled' })
  @IsOptional()
  @IsBoolean()
  cancelled?: boolean | null;

  @ApiProperty({ type: Number, description: 'The duration of the timeblock' })
  @IsNotEmpty()
  @IsNumber()
  duration: number;

  @ApiProperty({ type: Date, description: 'End time for the timeblock' })
  @IsNotEmpty()
  @IsDateString()
  endAt: Date;

  @ApiProperty({ type: Object, description: 'The location associated with the timeblock' })
  @IsNotEmpty()
  @IsObject()
  location: BoulevardLocationSummary;

  @ApiPropertyOptional({ enum: TimeblockReason, description: 'The reason for the time being blocked (BUSINESS | PERSONAL)' })
  @IsOptional()
  @IsEnum(TimeblockReason)
  reason?: TimeblockReason | null;

  @ApiProperty({ type: Object, description: 'The staff whose time is blocked' })
  @IsNotEmpty()
  @IsObject()
  staff: StaffSummary;

  @ApiProperty({ type: String, description: 'The ID of the staff whose time is blocked' })
  @IsNotEmpty()
  @IsString()
  staffId: string;

  @ApiProperty({ type: Date, description: 'Start time for the timeblock' })
  @IsNotEmpty()
  @IsDateString()
  startAt: Date;

  @ApiPropertyOptional({ type: String, description: 'The title of the timeblock' })
  @IsOptional()
  @IsString()
  title?: string | null;
}
