import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class SetTimeDto {
  @ApiProperty({ description: '预约开始时间 (ISO 8601)' })
  @IsDateString()
  startAt: string;
}
