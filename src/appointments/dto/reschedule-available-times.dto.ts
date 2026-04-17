import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class RescheduleAvailableTimesDto {
  @ApiProperty({ description: '查询日期 (ISO 8601 date, e.g. 2026-04-20)' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: '时区 (e.g. America/New_York)' })
  @IsOptional()
  @IsString()
  tz?: string;
}
