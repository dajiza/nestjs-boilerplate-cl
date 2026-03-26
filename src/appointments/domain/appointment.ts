import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Appointment {
  // ===== 必填字段 =====

  @ApiPropertyOptional({
    type: String,
    description: 'The ID of an object (auto-generated if not provided)',
  })
  id?: string;

  @ApiProperty({
    type: Date,
    description: 'Start time for the appointment',
  })
  startAt: Date;

  @ApiProperty({
    type: Date,
    description: 'When the appointment was created (in Etc/UTC)',
  })
  createdAt: Date;

  @ApiProperty({
    type: Boolean,
    description: 'Boolean signifying if the appointment is cancelled or not',
  })
  cancelled: boolean;

  @ApiProperty({
    type: String,
    description: 'Staff ID',
  })
  staffId: string;

  // ===== 可选字段 =====

  @ApiPropertyOptional({
    type: Object,
    description: 'Service options chosen with this appointment service',
  })
  appointmentServiceOptions?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The resources associated with the appointment',
  })
  appointmentServiceResources?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'A collection of appointment services',
  })
  appointmentServices?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Booked by type',
  })
  bookedByType?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Links to allow direct addition of the appointment to different calendar platforms',
  })
  calendarLinks?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Information about the cancellation, if present',
  })
  cancellation?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The client of the appointment',
  })
  client?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The id of the client of the appointment',
  })
  clientId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Message provided by the client',
  })
  clientMessage?: string | null;

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
    type: Number,
    description: 'The duration of the appointment',
  })
  duration?: number | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'End time for the appointment',
  })
  endAt?: Date | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indicates whether the appointment is part of a group appointment',
  })
  isGroupedAppointment?: boolean | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indicates if the appointment belongs to a recurring series',
  })
  isRecurring?: boolean | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Indicates that the appointment is due to be carried out remotely',
  })
  isRemote?: boolean | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The Location where this appointment was booked',
  })
  location?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The Id of the Location where this appointment was booked',
  })
  locationId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The URL at which a client can manage their own booking',
  })
  manageUrl?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Internal notes on the appointment',
  })
  notes?: string | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Boolean value to indicate whether a notification email should have been sent to the client when the appointment was cancelled',
  })
  notifyClientCancel?: boolean | null;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Boolean value to indicate whether a notification email should have been sent to the client when the appointment was booked',
  })
  notifyClientCreate?: boolean | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The id of the order that the appointment was checked out with',
  })
  orderId?: string | null;

  @ApiPropertyOptional({
    type: Number,
    description: 'The total remaining forms that need to be completed for this appointment',
  })
  pendingFormCount?: number | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'The rating for this appointment',
  })
  rating?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Options for joining a virtual meeting for this appointment',
  })
  remotePlatforms?: Record<string, any> | null;

  @ApiPropertyOptional({
    type: String,
    description: 'The state of the appointment',
  })
  state?: string | null;

  @ApiPropertyOptional({
    type: Object,
    description: 'Tags that have been applied to the appointment',
  })
  tags?: Record<string, any>[] | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Room ID',
  })
  roomId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Equipment ID',
  })
  equipmentId?: string | null;

  @ApiPropertyOptional({
    type: String,
    description: 'Cal.com booking UID for synchronization',
  })
  calComBookingId?: string | null;
}
