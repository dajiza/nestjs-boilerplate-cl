import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ServiceAddon, ServiceCategorySummary, ServiceOptionGroup, ServiceOverride, ServiceStatus } from '../../utils/types/boulevard.types';

export class ServiceDto {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiProperty({ type: String, description: 'Name' })
  name: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  active: boolean;

  @ApiProperty({ type: Boolean, description: 'Addon' })
  addon: boolean;

  @ApiProperty({ type: Date, description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'Updated at' })
  updatedAt: Date;

  @ApiProperty({ type: Number, description: 'Default duration in minutes' })
  defaultDuration: number;

  @ApiProperty({ type: Number, description: 'Default price in cents' })
  defaultPrice: number;

  @ApiPropertyOptional({ type: String, description: 'Category ID' })
  categoryId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom' })
  custom?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom fields' })
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Addons' })
  addons?: ServiceAddon[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Category' })
  category?: ServiceCategorySummary | null;

  @ApiPropertyOptional({ type: String, description: 'Description' })
  description?: string | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  externalId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Service option groups' })
  serviceOptionGroups?: ServiceOptionGroup[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Service overrides' })
  serviceOverrides?: ServiceOverride | null;

  @ApiPropertyOptional({ type: Object, description: 'Service status' })
  serviceStatus?: ServiceStatus | null;

  @ApiPropertyOptional({ type: Object, description: 'Sort path' })
  sortPath?: string | null;
}
