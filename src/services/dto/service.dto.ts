import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

  @ApiPropertyOptional({ type: String, description: 'Location ID' })
  locationId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Category ID' })
  categoryId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom' })
  custom?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom fields' })
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: [String], description: 'Keys' })
  keys?: string[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Addons' })
  addons?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Category' })
  category?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Description' })
  description?: string | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  externalId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Service option groups' })
  serviceOptionGroups?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Service overrides' })
  serviceOverrides?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Service status' })
  serviceStatus?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Sort path' })
  sortPath?: Record<string, any> | null;
}
