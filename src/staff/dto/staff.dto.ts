import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StaffDto {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiProperty({ type: String, description: 'Email address' })
  email: string;

  @ApiProperty({ type: String, description: 'Full name' })
  name: string;

  @ApiProperty({ type: String, description: 'Mobile phone' })
  mobilePhone: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  active: boolean;

  @ApiPropertyOptional({ type: String, description: 'Display name' })
  displayName?: string | null;

  @ApiPropertyOptional({ type: String, description: 'First name' })
  firstName?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Last name' })
  lastName?: string | null;

  @ApiPropertyOptional({ type: Date, description: 'Created at' })
  createdAt?: Date | null;

  @ApiPropertyOptional({ type: Date, description: 'Updated at' })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ type: String, description: 'Alternate Id' })
  alternateId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'App Role' })
  appRole?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'App Role ID' })
  appRoleId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Avatar' })
  avatar?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Bio' })
  bio?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Enabled for future locations',
  })
  enabledForFutureLocations?: boolean | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  externalId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'External nickname' })
  externalNickname?: string | null;

  @ApiPropertyOptional({ type: Boolean, description: 'External bookability' })
  externallyBookable?: boolean | null;

  @ApiPropertyOptional({ type: Object, description: 'Location abilities' })
  locationAbilities?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Location ID' })
  locationId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Locations' })
  locations?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: String, description: 'Nickname' })
  nickname?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Role' })
  role?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Role ID' })
  staffRoleId?: string | null;

  @ApiPropertyOptional({ type: Boolean, description: 'Suspended' })
  suspended?: boolean | null;
}
