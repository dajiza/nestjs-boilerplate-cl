import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Address, LocationDays, PaymentOption } from '../../utils/types/boulevard.types';

// Matches Boulevard GraphQL Admin API Location type
// https://developers.joinblvd.com/graphql-admin-api/api-reference/types/Location
export class Location {
  @ApiProperty({ type: String, description: 'The ID of the location' })
  id: string;

  @ApiProperty({ type: String, description: 'Name of the location' })
  name: string;

  @ApiProperty({ type: Object, description: 'Address of the location (line1, line2, city, country, province, state, zip)' })
  address: Address = {} as Address;

  @ApiPropertyOptional({ type: String, description: 'Instructions for a client upon arrival at the location' })
  arrivalInstructions?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Billing contact email for the location' })
  billingContactEmail?: string | null;

  @ApiProperty({ type: String, description: "Name of the location's business" })
  businessName: string;

  @ApiPropertyOptional({ type: String, description: 'Contact email for the location' })
  contactEmail?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Coordinates of the location (lat, lng)' })
  coordinates?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Location external id' })
  externalId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Google Place ID' })
  googlePlaceId?: string | null;

  @ApiPropertyOptional({ type: Array, description: 'Location daily business hours' })
  hours?: LocationDays[] | null;

  @ApiProperty({ type: Boolean, description: 'Indicates that the location is a remote location' })
  isRemote: boolean;

  @ApiProperty({ type: Array, description: 'Payment options for the location' })
  paymentOptions: PaymentOption[] = [];

  @ApiPropertyOptional({ type: String, description: 'Phone number for the location' })
  phone?: string | null;

  @ApiProperty({ type: Boolean, description: 'A setting to enable/disable showing the location hours' })
  showLocationHours: boolean;

  @ApiProperty({ type: String, description: 'Timezone associated with the location' })
  tz: string;

  @ApiPropertyOptional({ type: String, description: 'Website for the location' })
  website?: string | null;
}
