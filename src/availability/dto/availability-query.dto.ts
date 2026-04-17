import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';

export class AvailableDatesQueryDto {
  @ApiProperty({ description: '门店 ID' })
  @IsString()
  locationId: string;

  @ApiProperty({ description: '服务 ID' })
  @IsString()
  serviceId: string;

  @ApiPropertyOptional({ description: '指定员工 ID' })
  @IsOptional()
  @IsString()
  staffId?: string;

  @ApiPropertyOptional({ description: '搜索范围起始日期 (ISO 8601)，默认今天' })
  @IsOptional()
  @IsDateString()
  searchRangeLower?: string;

  @ApiPropertyOptional({ description: '搜索范围截止日期 (ISO 8601)，默认30天后' })
  @IsOptional()
  @IsDateString()
  searchRangeUpper?: string;
}

export class AvailableTimesQueryDto {
  @ApiProperty({ description: '门店 ID' })
  @IsString()
  locationId: string;

  @ApiProperty({ description: '服务 ID' })
  @IsString()
  serviceId: string;

  @ApiProperty({ description: '查询日期 (ISO 8601 date, e.g. 2026-04-10)' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: '指定员工 ID' })
  @IsOptional()
  @IsString()
  staffId?: string;
}

export class AvailableStaffQueryDto {
  @ApiProperty({ description: '门店 ID' })
  @IsString()
  locationId: string;

  @ApiProperty({ description: '服务 ID' })
  @IsString()
  serviceId: string;

  @ApiProperty({ description: '预约开始时间 (ISO 8601)' })
  @IsDateString()
  startAt: string;

  @ApiPropertyOptional({ description: '预约时长（分钟），默认使用服务的 defaultDuration' })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(480)
  durationMinutes?: number;
}
