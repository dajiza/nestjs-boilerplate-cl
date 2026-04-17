import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsBoolean } from 'class-validator';

/**
 * 对应 Boulevard AppointmentRescheduleInput
 * Boulevard 使用 bookableTimeId 引用预计算的时段，我们简化为直接传 startAt/staffId
 */
export class RescheduleAppointmentDto {
  @ApiProperty({ description: '新的开始时间 (ISO 8601)' })
  @IsDateString()
  startAt: string;

  @ApiPropertyOptional({ description: '新员工 ID（可选，不改员工时不传）' })
  @IsOptional()
  @IsString()
  staffId?: string;

  @ApiProperty({ description: '是否发送通知给客户', default: true })
  @IsOptional()
  @IsBoolean()
  sendNotification?: boolean;
}
