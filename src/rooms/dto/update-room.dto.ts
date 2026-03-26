import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto {
  @ApiPropertyOptional({ type: String, description: 'Room name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'Service ID' })
  @IsOptional()
  @IsString()
  serviceId?: string | null;
}
