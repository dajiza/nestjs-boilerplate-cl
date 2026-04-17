import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject, IsArray, IsEmail, IsBoolean } from 'class-validator';
import type { Address, LocationDays, PaymentOption } from '../../utils/types/boulevard.types';

export class CreateLocationDto {
  @ApiProperty({ type: String, description: 'The ID of the location' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ type: String, description: 'Name of the location' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: Object, description: 'Address of the location' })
  @IsOptional()
  @IsObject()
  address?: Address | null;

  @ApiPropertyOptional({ type: String, description: 'Instructions for a client upon arrival' })
  @IsOptional()
  @IsString()
  arrivalInstructions?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Billing contact email' })
  @IsOptional()
  @IsEmail()
  billingContactEmail?: string | null;

  @ApiProperty({ type: String, description: "Name of the location's business" })
  @IsNotEmpty()
  @IsString()
  businessName: string;

  @ApiPropertyOptional({ type: String, description: 'Contact email' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Coordinates (lat, lng)' })
  @IsOptional()
  @IsObject()
  coordinates?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Location external id' })
  @IsOptional()
  @IsString()
  externalId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Google Place ID' })
  @IsOptional()
  @IsString()
  googlePlaceId?: string | null;

  @ApiPropertyOptional({ type: Array, description: 'Location daily business hours' })
  @IsOptional()
  @IsArray()
  hours?: LocationDays[] | null;

  @ApiProperty({ type: Boolean, description: 'Indicates remote location' })
  @IsBoolean()
  isRemote: boolean;

  @ApiProperty({ type: Array, description: 'Payment options' })
  @IsOptional()
  @IsArray()
  paymentOptions?: PaymentOption[] | null;

  @ApiPropertyOptional({ type: String, description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiProperty({ type: Boolean, description: 'Enable/disable showing location hours' })
  @IsBoolean()
  showLocationHours: boolean;

  @ApiProperty({ type: String, description: 'Timezone' })
  @IsNotEmpty()
  @IsString()
  tz: string;

  @ApiPropertyOptional({ type: String, description: 'Website' })
  @IsOptional()
  @IsString()
  website?: string | null;
}
