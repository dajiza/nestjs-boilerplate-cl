import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsEmail, IsString, IsObject, IsArray, IsDateString } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: String, description: 'Email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, description: 'Full name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, description: 'Mobile phone' })
  @IsNotEmpty()
  @IsString()
  mobilePhone: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  @IsBoolean()
  active: boolean;

  @ApiPropertyOptional({ type: String, description: 'Display name' })
  @IsOptional()
  @IsString()
  displayName?: string | null;

  @ApiPropertyOptional({ type: String, description: 'First name' })
  @IsOptional()
  @IsString()
  firstName?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Last name' })
  @IsOptional()
  @IsString()
  lastName?: string | null;

  @ApiPropertyOptional({ type: Date, description: 'Created at' })
  @IsOptional()
  @IsDateString()
  createdAt?: Date | null;

  @ApiPropertyOptional({ type: Date, description: 'Updated at' })
  @IsOptional()
  @IsDateString()
  updatedAt?: Date | null;

  @ApiPropertyOptional({ type: String, description: 'Alternate Id' })
  @IsOptional()
  @IsString()
  alternateId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'App Role' })
  @IsOptional()
  @IsObject()
  appRole?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'App Role ID' })
  @IsOptional()
  @IsString()
  appRoleId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Avatar' })
  @IsOptional()
  @IsString()
  avatar?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Bio' })
  @IsOptional()
  @IsString()
  bio?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Enabled for future locations',
  })
  @IsOptional()
  @IsBoolean()
  enabledForFutureLocations?: boolean | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  @IsOptional()
  @IsString()
  externalId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'External nickname' })
  @IsOptional()
  @IsString()
  externalNickname?: string | null;

  @ApiPropertyOptional({ type: Boolean, description: 'External bookability' })
  @IsOptional()
  @IsBoolean()
  externallyBookable?: boolean | null;

  @ApiPropertyOptional({ type: Object, description: 'Location abilities' })
  @IsOptional()
  @IsObject()
  locationAbilities?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Location ID' })
  @IsOptional()
  @IsString()
  locationId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Locations' })
  @IsOptional()
  @IsArray()
  locations?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: String, description: 'Nickname' })
  @IsOptional()
  @IsString()
  nickname?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Role' })
  @IsOptional()
  @IsObject()
  role?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Role ID' })
  @IsOptional()
  @IsString()
  staffRoleId?: string | null;

  @ApiPropertyOptional({ type: Boolean, description: 'Suspended' })
  @IsOptional()
  @IsBoolean()
  suspended?: boolean | null;
}
