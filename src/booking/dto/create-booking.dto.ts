import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: '门店 ID' })
  @IsString()
  locationId: string;
}
