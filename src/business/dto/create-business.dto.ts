import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsObject, IsArray, IsString } from 'class-validator';
import type { Address } from '../../utils/types/boulevard.types';

export class CreateBusinessDto {
  @ApiProperty({
    type: String,
    description: 'The ID of the business',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    type: String,
    description: 'Name of the business',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: Object,
    description: 'Address of the business',
  })
  @IsOptional()
  @IsObject()
  address?: Address | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'A setting to let a business decide if a person with multiple client profiles can log in to one of their profiles',
  })
  @IsOptional()
  @IsBoolean()
  allowLoginWithMultipleClients?: boolean | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Billing contact email for the business',
  })
  @IsOptional()
  @IsString()
  billingContactEmail?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Custom field data wrapper',
  })
  @IsOptional()
  @IsObject()
  custom?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Custom fields',
  })
  @IsOptional()
  @IsArray()
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Custom booking URL',
  })
  @IsOptional()
  @IsString()
  customBookingUrl?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Phone number for the business',
  })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'A setting to enable/disable the ability to set and show the business location hours',
  })
  @IsOptional()
  @IsBoolean()
  showLocationHours?: boolean | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Timezone associated with the business',
  })
  @IsOptional()
  @IsString()
  tz?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Website for the business',
  })
  @IsOptional()
  @IsString()
  website?: string | null;
}
