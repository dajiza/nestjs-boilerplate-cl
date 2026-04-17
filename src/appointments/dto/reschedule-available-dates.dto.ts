import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class RescheduleAvailableDatesDto {
  @ApiProperty({ description: '搜索范围起始日期 (ISO 8601, e.g. 2026-04-16)' })
  @IsDateString()
  searchRangeLower: string;

  @ApiProperty({ description: '搜索范围截止日期 (ISO 8601, e.g. 2026-05-16)' })
  @IsDateString()
  searchRangeUpper: string;

  @ApiPropertyOptional({ description: '时区 (e.g. America/New_York)' })
  @IsOptional()
  @IsString()
  tz?: string;
}
