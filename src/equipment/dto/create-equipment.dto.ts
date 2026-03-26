import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEquipmentDto {
  @ApiProperty({ type: String, description: 'Equipment name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String, description: 'Service ID' })
  @IsOptional()
  @IsString()
  serviceId?: string | null;
}
