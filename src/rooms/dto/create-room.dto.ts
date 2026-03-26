import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ type: String, description: 'Room name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String, description: 'Service ID' })
  @IsOptional()
  @IsString()
  serviceId?: string | null;
}
