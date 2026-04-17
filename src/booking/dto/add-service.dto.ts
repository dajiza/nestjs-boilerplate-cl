import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, IsArray } from 'class-validator';

export class AddServiceDto {
  @ApiProperty({ description: '服务 ID' })
  @IsString()
  serviceId: string;

  @ApiPropertyOptional({ description: '指定员工 ID' })
  @IsOptional()
  @IsString()
  staffId?: string;

  @ApiPropertyOptional({ description: '开始时间偏移（分钟），默认 0' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  startTimeOffset?: number;
}

export class RemoveServiceDto {
  @ApiProperty({ description: '服务索引' })
  @IsNumber()
  @Min(0)
  index: number;
}
