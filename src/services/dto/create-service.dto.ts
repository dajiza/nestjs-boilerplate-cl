import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsString, IsObject, IsArray, IsDateString, IsInt } from 'class-validator';
import type { ServiceAddon, ServiceCategorySummary, ServiceOptionGroup, ServiceOverride, ServiceStatus } from '../../utils/types/boulevard.types';

export class CreateServiceDto {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: String, description: 'Name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  @IsBoolean()
  active: boolean;

  @ApiProperty({ type: Boolean, description: 'Addon' })
  @IsBoolean()
  addon: boolean;

  @ApiProperty({ type: Date, description: 'Created at' })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Updated at' })
  @IsDateString()
  updatedAt: Date;

  @ApiProperty({ type: Number, description: 'Default duration in minutes' })
  @IsInt()
  defaultDuration: number;

  @ApiProperty({ type: Number, description: 'Default price in cents' })
  @IsInt()
  defaultPrice: number;

  @ApiPropertyOptional({ type: String, description: 'Category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom' })
  @IsOptional()
  @IsObject()
  custom?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom fields' })
  @IsOptional()
  @IsArray()
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Addons' })
  @IsOptional()
  @IsArray()
  addons?: ServiceAddon[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Category' })
  @IsOptional()
  @IsObject()
  category?: ServiceCategorySummary | null;

  @ApiPropertyOptional({ type: String, description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  @IsOptional()
  @IsString()
  externalId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Service option groups' })
  @IsOptional()
  @IsArray()
  serviceOptionGroups?: ServiceOptionGroup[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Service overrides' })
  @IsOptional()
  @IsObject()
  serviceOverrides?: ServiceOverride | null;

  @ApiPropertyOptional({ type: Object, description: 'Service status' })
  @IsOptional()
  @IsObject()
  serviceStatus?: ServiceStatus | null;

  @ApiPropertyOptional({ type: String, description: 'Sort path' })
  @IsOptional()
  @IsString()
  sortPath?: string | null;
}
