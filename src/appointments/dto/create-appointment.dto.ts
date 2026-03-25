import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsArray, IsObject, IsNumber, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: Date, description: 'Start time for the appointment' })
  @IsDateString()
  startAt: Date;

  @ApiProperty({
    type: Date,
    description: 'When the appointment was created (in Etc/UTC)',
  })
  @IsDateString()
  createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Boolean signifying if the appointment is cancelled or not',
  })
  @IsBoolean()
  cancelled: boolean;

  @ApiProperty({ type: String, description: 'Staff ID' })
  @IsNotEmpty()
  staffId: string;

  @ApiPropertyOptional({
    type: Object,
    description: 'Service options chosen with this appointment service',
  })
  @IsOptional()
  @IsArray()
  appointmentServiceOptions?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The resources associated with the appointment',
  })
  @IsOptional()
  @IsArray()
  appointmentServiceResources?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'A collection of appointment services',
  })
  @IsOptional()
  @IsArray()
  appointmentServices?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: String, description: 'Booked by type' })
  @IsOptional()
  @IsString()
  bookedByType?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Links to allow direct addition of the appointment to different calendar platforms',
  })
  @IsOptional()
  @IsObject()
  calendarLinks?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Information about the cancellation, if present',
  })
  @IsOptional()
  @IsObject()
  cancellation?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The client of the appointment',
  })
  @IsOptional()
  @IsObject()
  client?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The id of the client of the appointment',
  })
  @IsOptional()
  @IsString()
  clientId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Message provided by the client',
  })
  @IsOptional()
  @IsString()
  clientMessage?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Custom field data wrapper',
  })
  @IsOptional()
  @IsObject()
  custom?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom fields' })
  @IsOptional()
  @IsArray()
  customFields?: Record<string, any>[] | null;

  @ApiPropertyOptional({ type: [String], description: 'Keys' })
  @IsOptional()
  @IsArray()
  keys?: string[] | null;

  @ApiPropertyOptional({
    type: Number,
    description: 'The duration of the appointment',
  })
  @IsOptional()
  @IsNumber()
  duration?: number | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'End time for the appointment',
  })
  @IsOptional()
  @IsDateString()
  endAt?: Date | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indicates whether the appointment is part of a group appointment',
  })
  @IsOptional()
  @IsBoolean()
  isGroupedAppointment?: boolean | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indicates if the appointment belongs to a recurring series',
  })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indicates that the appointment is due to be carried out remotely',
  })
  @IsOptional()
  @IsBoolean()
  isRemote?: boolean | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The Location where this appointment was booked',
  })
  @IsOptional()
  @IsObject()
  location?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The Id of the Location where this appointment was booked',
  })
  @IsOptional()
  @IsString()
  locationId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The URL at which a client can manage their own booking',
  })
  @IsOptional()
  @IsString()
  manageUrl?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Internal notes on the appointment',
  })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Boolean value to indicate whether a notification email should have been sent to the client when the appointment was cancelled',
  })
  @IsOptional()
  @IsBoolean()
  notifyClientCancel?: boolean | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Boolean value to indicate whether a notification email should have been sent to the client when the appointment was booked',
  })
  @IsOptional()
  @IsBoolean()
  notifyClientCreate?: boolean | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The id of the order that the appointment was checked out with',
  })
  @IsOptional()
  @IsString()
  orderId?: string | null;

  @ApiPropertyOptional({
    type: Number,
    description: 'The total remaining forms that need to be completed for this appointment',
  })
  @IsOptional()
  @IsNumber()
  pendingFormCount?: number | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The rating for this appointment',
  })
  @IsOptional()
  @IsObject()
  rating?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Options for joining a virtual meeting for this appointment',
  })
  @IsOptional()
  @IsObject()
  remotePlatforms?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The state of the appointment',
  })
  @IsOptional()
  @IsString()
  state?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Tags that have been applied to the appointment',
  })
  @IsOptional()
  @IsArray()
  tags?: Record<string, any>[] | null;
}
