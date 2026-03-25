import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Staff {
  // ===== 必填字段 =====

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

  // ===== 可选字段 =====

  @ApiPropertyOptional({ type: String, description: 'Display name' })
  displayName?: string | null;

  @ApiPropertyOptional({ type: String, description: 'First name' })
  firstName?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Last name' })
  lastName?: string | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'The date and time when the staff was created',
  })
  createdAt?: Date | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'The date and time when the staff was last updated',
  })
  updatedAt?: Date | null;

  @ApiPropertyOptional({ type: String, description: 'Alternate Id' })
  alternateId?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'App Role' })
  appRole?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'App Role ID' })
  appRoleId?: string | null;

  @ApiPropertyOptional({ type: String, description: 'Avatar' })
  avatar?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Friendly bio for the staff',
  })
  bio?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'If the staff is enabled for future locations',
  })
  enabledForFutureLocations?: boolean | null;

  @ApiPropertyOptional({ type: String, description: 'External Id' })
  externalId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: "A staff member's client facing nickname",
  })
  externalNickname?: string | null;

  @ApiPropertyOptional({ type: Boolean, description: 'External bookability' })
  externallyBookable?: boolean | null;

  @ApiPropertyOptional({ type: Object, description: 'Location abilities' })
  locationAbilities?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Location ID' })
  locationId?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'List of locations the staff is assigned to',
  })
  locations?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: String, description: 'Nick name' })
  nickname?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Role' })
  role?: Record<string, any> | null;

  @ApiPropertyOptional({ type: String, description: 'Role ID' })
  staffRoleId?: string | null;

  @ApiPropertyOptional({ type: Boolean, description: 'Suspended' })
  suspended?: boolean | null;
}
