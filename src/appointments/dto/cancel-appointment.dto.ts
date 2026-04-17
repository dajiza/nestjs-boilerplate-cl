import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsBoolean, IsOptional, IsString } from 'class-validator';
import { CancellationReason } from '../domain/cancellation-reason';

export class CancelAppointmentDto {
  @ApiProperty({ enum: CancellationReason, description: '取消原因' })
  @IsEnum(CancellationReason)
  reason: CancellationReason;

  @ApiPropertyOptional({ description: '是否通知客户', default: true })
  @IsOptional()
  @IsBoolean()
  notifyClient?: boolean;

  @ApiPropertyOptional({ description: '取消备注' })
  @IsOptional()
  @IsString()
  notes?: string;
}
