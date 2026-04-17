import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsEnum } from 'class-validator';
import { AppointmentState } from '../domain/appointment-state';

/**
 * 对应 Boulevard UpdateAppointmentInput
 * 只允许更新 notes / customFields / state
 */
export class UpdateAppointmentDto {
  @ApiPropertyOptional({ description: 'Internal notes on the appointment' })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiPropertyOptional({
    type: [Object],
    description: 'Custom field data',
  })
  @IsOptional()
  @IsArray()
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    enum: AppointmentState,
    description: 'The state of the appointment (BOOKED/CONFIRMED/ARRIVED/ACTIVE)',
  })
  @IsOptional()
  @IsEnum(AppointmentState)
  state?: AppointmentState;
}
