import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetClientDto {
  @ApiProperty({ description: '客户 ID' })
  @IsString()
  clientId: string;
}
