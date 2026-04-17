import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class SetStaffDto {
  @ApiProperty({ description: '服务索引' })
  @IsNumber()
  @Min(0)
  serviceIndex: number;

  @ApiProperty({ description: '员工 ID' })
  @IsString()
  staffId: string;
}
