import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsDateString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryAppointmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by staff ID' })
  @IsOptional()
  @IsString()
  staffId?: string;

  @ApiPropertyOptional({ description: 'Filter by room ID' })
  @IsOptional()
  @IsUUID()
  roomId?: string;

  @ApiPropertyOptional({ description: 'Filter by equipment ID' })
  @IsOptional()
  @IsUUID()
  equipmentId?: string;

  @ApiPropertyOptional({ description: 'Filter by start date (ISO string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter by end date (ISO string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
