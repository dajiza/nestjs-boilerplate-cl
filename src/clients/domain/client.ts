import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Client {
  @ApiProperty({
    type: String,
    description: 'The ID of an object',
  })
  id: string;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the client is active internally in Boulevard. Deactivated clients are usually merged with other clients',
  })
  active: boolean;

  @ApiProperty({
    type: Number,
    description: 'The total number of appointments that this client has booked (excluding cancelled appointemnts)',
  })
  appointmentCount: number;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the client was created',
  })
  createdAt: Date;

  @ApiPropertyOptional({
    type: Object,
    description: 'Credit cards on file for the client',
  })
  creditCardsOnFile?: Record<string, any>[] | null;

  @ApiProperty({
    type: Number,
    description: 'Account Balance associated with this client',
  })
  currentAccountBalance: number;

  @ApiPropertyOptional({
    type: Date,
    description: 'Account Balance updated at',
  })
  currentAccountUpdatedAt?: Date | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Custom field data wrapper',
  })
  custom?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Custom fields',
  })
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: [String],
    description: 'Keys',
  })
  keys?: string[] | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'Date of birth',
  })
  dob?: Date | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Email address',
  })
  email?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'External client ID',
  })
  externalId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'First name',
  })
  firstName?: string | null;

  @ApiProperty({
    type: Boolean,
    description: 'Whether the client has a credit card on file',
  })
  hasCardOnFile: boolean;

  @ApiPropertyOptional({
    type: String,
    description: 'Last name',
  })
  lastName?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: "The client's marketing settings",
  })
  marketingSettings?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: String,
    description: 'ID of the client this client was merged into, if inactive',
  })
  mergedIntoClientId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Mobile phone number',
  })
  mobilePhone?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Full name',
  })
  name?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Notes that are available for the client',
  })
  notes?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Primary location (based on last 3 appointments)',
  })
  primaryLocation?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Pronoun',
  })
  pronoun?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: "The client's reminder settings",
  })
  reminderSettings?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Scheduling alert',
  })
  schedulingAlert?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Tags that have been applied to the client',
  })
  tags?: Record<string, any>[] | null;

  @ApiProperty({
    type: Date,
    description: 'The date and time when the client was last updated',
  })
  updatedAt: Date;
}
