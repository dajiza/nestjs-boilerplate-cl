import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Service {
  // ===== 必填字段 =====

  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiProperty({ type: String, description: 'Name' })
  name: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  active: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Addons can only booked alongside a standalone service',
  })
  addon: boolean;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the service was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the service was last updated',
  })
  updatedAt: Date;

  @ApiProperty({ type: Number, description: 'Default duration in minutes' })
  defaultDuration: number;

  @ApiProperty({ type: Number, description: 'Default price in cents' })
  defaultPrice: number;

  // ===== 可选字段 =====

  @ApiPropertyOptional({ type: String, description: 'Location ID' })
  locationId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Service Category Id' })
  categoryId?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Custom field data wrapper',
  })
  custom?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom fields' })
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: [String], description: 'Keys' })
  keys?: string[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Addons' })
  addons?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Service Category' })
  category?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Description' })
  description?: string | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  externalId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Service Option Groups' })
  serviceOptionGroups?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: Object, description: 'Service overrides' })
  serviceOverrides?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Service status' })
  serviceStatus?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Order which this service is displayed',
  })
  sortPath?: Record<string, any> | null;
}
