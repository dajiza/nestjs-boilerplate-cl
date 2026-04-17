import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AppointmentState } from '../domain/appointment-state';

export class UpdateStateDto {
  @ApiProperty({ enum: AppointmentState, description: '目标状态（仅限 BOOKED/CONFIRMED/ARRIVED/ACTIVE）' })
  @IsEnum(AppointmentState)
  state: AppointmentState;
}
