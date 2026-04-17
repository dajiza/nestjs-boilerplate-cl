import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsNumber, IsDateString, IsEmail, IsArray, IsObject } from 'class-validator';
import type {
  CreditCard,
  MarketingSetting,
  ClientNote,
  BoulevardLocationSummary,
  ReminderSetting,
  BoulevardTag,
} from '../../utils/types/boulevard.types';

export class CreateClientDto {
  @ApiProperty({
    type: String,
    description: 'The ID of an object',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the client is active internally in Boulevard. Deactivated clients are usually merged with other clients',
  })
  @IsBoolean()
  active: boolean;

  @ApiProperty({
    type: Number,
    description: 'The total number of appointments that this client has booked (excluding cancelled appointemnts)',
  })
  @IsNumber()
  appointmentCount: number;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the client was created',
  })
  @IsDateString()
  createdAt: Date;

  @ApiPropertyOptional({
    type: Object,
    description: 'Credit cards on file for the client',
  })
  @IsOptional()
  @IsArray()
  creditCardsOnFile?: CreditCard[] | null;

  @ApiProperty({
    type: Number,
    description: 'Account Balance associated with this client',
  })
  @IsNumber()
  currentAccountBalance: number;

  @ApiPropertyOptional({
    type: Date,
    description: 'Account Balance updated at',
  })
  @IsOptional()
  @IsDateString()
  currentAccountUpdatedAt?: Date | null;

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
    type: Date,
    description: 'Date of birth',
  })
  @IsOptional()
  @IsDateString()
  dob?: Date | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Email address',
  })
  @IsOptional()
  @IsEmail()
  email?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'External client ID',
  })
  @IsOptional()
  externalId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'First name',
  })
  @IsOptional()
  firstName?: string | null;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the client has a credit card on file',
  })
  @IsBoolean()
  hasCardOnFile: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Last name',
  })
  @IsOptional()
  lastName?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: "The client's marketing settings",
  })
  @IsOptional()
  @IsArray()
  marketingSettings?: MarketingSetting[] | null;

  @ApiPropertyOptional({
    type: String,
    description: 'ID of the client this client was merged into, if inactive',
  })
  @IsOptional()
  mergedIntoClientId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Mobile phone number',
  })
  @IsOptional()
  mobilePhone?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Full name',
  })
  @IsOptional()
  name?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Notes that are available for the client',
  })
  @IsOptional()
  @IsArray()
  notes?: ClientNote[] | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Primary location (based on last 3 appointments)',
  })
  @IsOptional()
  @IsObject()
  primaryLocation?: BoulevardLocationSummary | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Pronoun',
  })
  @IsOptional()
  pronoun?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: "The client's reminder settings",
  })
  @IsOptional()
  @IsArray()
  reminderSettings?: ReminderSetting[] | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Scheduling alert',
  })
  @IsOptional()
  schedulingAlert?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Tags that have been applied to the client',
  })
  @IsOptional()
  @IsArray()
  tags?: BoulevardTag[] | null;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the client was last updated',
  })
  @IsDateString()
  updatedAt: Date;
}
