import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsObject, IsDateString } from 'class-validator';

export class CreateServiceCategoryDto {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ type: String, description: 'Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ type: Date, description: 'The date and time when the service category was created' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'The date and time when the service category was last updated' })
  @IsDateString()
  updatedAt: Date;

  @ApiPropertyOptional({ type: Object, description: 'Services' })
  @IsOptional()
  @IsObject()
  services?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Order which this service category is displayed alongside others' })
  @IsOptional()
  @IsObject()
  sortPath?: string | null;
}
