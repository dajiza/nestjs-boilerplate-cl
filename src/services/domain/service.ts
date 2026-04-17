import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ServiceAddon, ServiceCategorySummary, ServiceOptionGroup, ServiceOverride, ServiceStatus } from '../../utils/types/boulevard.types';

export class Service {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  active: boolean;

  @ApiProperty({
    type: Boolean,
    description: 'Addons can only booked alongside a standalone service and are not exposed in online booking',
  })
  addon: boolean;

  @ApiProperty({ type: Object, description: 'Get any addons that are bookable at the given location' })
  addons: ServiceAddon[];

  @ApiProperty({ type: Object, description: 'Service Category' })
  category: ServiceCategorySummary;

  @ApiProperty({ type: String, description: 'Service Category Id' })
  categoryId: string;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the service was created',
  })
  createdAt: Date;

  @ApiProperty({ type: Object, description: 'Custom field data wrapper' })
  custom: Record<string, any>;

  @ApiProperty({ type: Object, description: 'Custom fields' })
  customFields: Record<string, any>[];

  @ApiProperty({ type: Number, description: 'Default duration in minutes' })
  defaultDuration: number;

  @ApiProperty({ type: Number, description: 'Default price in cents' })
  defaultPrice: number;

  @ApiPropertyOptional({ type: String, description: 'Description' })
  description?: string | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  externalId?: string | null;

  @ApiProperty({ type: String, description: 'Name' })
  name: string;

  @ApiProperty({ type: Object, description: 'Service Option Groups' })
  serviceOptionGroups: ServiceOptionGroup[];

  @ApiProperty({ type: Object, description: 'Get any service overrides that may be set' })
  serviceOverrides: ServiceOverride;

  @ApiProperty({ type: Object, description: 'Get any service status overrides that may be set' })
  serviceStatus: ServiceStatus;

  @ApiProperty({ type: Object, description: 'Order which this service is displayed alongside others' })
  sortPath: string;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the service was last updated',
  })
  updatedAt: Date;
}
