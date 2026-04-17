import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Address } from '../../utils/types/boulevard.types';

// Matches Boulevard GraphQL Admin API Business type
// https://developers.joinblvd.com/graphql-admin-api/api-reference/types/Business

export class Business {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiProperty({ type: String, description: 'Name of the business' })
  name: string;

  @ApiProperty({ type: Object, description: 'Address of the business' })
  address: Address;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'A setting to let a business decide if a person with multiple client profiles can log in to one of their profiles',
  })
  allowLoginWithMultipleClients?: boolean | null;

  @ApiPropertyOptional({ type: String, description: 'Billing contact email for the business' })
  billingContactEmail?: string | null;

  @ApiProperty({ type: Object, description: 'Custom field data wrapper' })
  custom: Record<string, any>;

  @ApiPropertyOptional({ type: String, description: 'An optional URL to use to direct customers to a custom booking flow' })
  customBookingUrl?: string | null;

  @ApiProperty({ type: Object, description: 'Custom fields' })
  customFields: Record<string, any>[];

  @ApiPropertyOptional({ type: String, description: 'Phone number for the business' })
  phone?: string | null;

  @ApiProperty({ type: Boolean, description: 'A setting to enable/disable the ability to set and show the business location hours' })
  showLocationHours: boolean;

  @ApiProperty({ type: String, description: 'Timezone associated with the business' })
  tz: string;

  @ApiPropertyOptional({ type: String, description: 'Website for the business' })
  website?: string | null;
}
