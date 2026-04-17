import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppRoleSummary, StaffLocationAbilities, BoulevardLocationSummary, StaffRoleSummary } from '../../utils/types/boulevard.types';

export class Staff {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Active' })
  active?: boolean | null;

  @ApiPropertyOptional({ type: String, description: 'Alternate Id' })
  alternateId?: string | null;

  @ApiProperty({ type: Object, description: 'App role' })
  appRole: AppRoleSummary;

  @ApiPropertyOptional({ type: String, description: 'App role ID' })
  appRoleId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Avatar' })
  avatar?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Friendly bio for the staff',
  })
  bio?: string | null;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the staff was created',
  })
  createdAt: Date;

  @ApiProperty({ type: String, description: 'Display name, preferred over other name fields in client-facing features' })
  displayName: string;

  @ApiPropertyOptional({ type: String, description: 'Email address' })
  email?: string | null;

  @ApiProperty({
    type: Boolean,
    description: 'If the staff is enabled for future locations',
  })
  enabledForFutureLocations: boolean;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  externalId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: "A staff member's client facing nickname",
  })
  externalNickname?: string | null;

  @ApiPropertyOptional({ type: Boolean, description: 'External bookability' })
  externallyBookable?: boolean | null;

  @ApiProperty({ type: String, description: 'First name' })
  firstName: string;

  @ApiPropertyOptional({ type: String, description: 'Last name' })
  lastName?: string | null;

  @ApiProperty({ type: Object, description: 'Object describing what actions the current staff member can perform with a location' })
  locationAbilities: StaffLocationAbilities;

  @ApiPropertyOptional({
    type: Object,
    description: 'List of locations the staff is assigned to',
  })
  locations?: BoulevardLocationSummary[] | null;

  @ApiPropertyOptional({ type: String, description: 'Mobile phone' })
  mobilePhone?: string | null;

  @ApiProperty({ type: String, description: 'Full name' })
  name: string;

  @ApiPropertyOptional({ type: String, description: 'Nick name' })
  nickname?: string | null;

  @ApiProperty({ type: Object, description: 'Role' })
  role: StaffRoleSummary;

  @ApiProperty({ type: String, description: 'Role ID' })
  staffRoleId: string;

  @ApiPropertyOptional({ type: Boolean, description: 'Suspended' })
  suspended?: boolean | null;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the staff was last updated',
  })
  updatedAt: Date;
}
