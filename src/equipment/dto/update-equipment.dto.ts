import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateEquipmentDto {
  @ApiPropertyOptional({ type: String, description: 'Equipment name' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: String, description: 'Service ID' })
  @IsOptional()
  @IsString()
  serviceId?: string | null;
}
