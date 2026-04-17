import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type {
  AppointmentClientSummary,
  AppointmentServiceOption,
  AppointmentServiceResource,
  AppointmentServiceItem,
  AppointmentCancellation,
  AppointmentRating,
  BoulevardLocationSummary,
  BoulevardTag,
  CalendarLinks,
  RemotePlatforms,
} from '../../utils/types/boulevard.types';

// Matches Boulevard GraphQL Admin API Appointment type
// Nullable fields align with schema.json nullable definitions

export class AppointmentDto {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiProperty({ type: Date, description: 'Start time for the appointment' })
  startAt: Date;

  @ApiProperty({ type: Date, description: 'When the appointment was created (in Etc/UTC)' })
  createdAt: Date;

  @ApiProperty({ type: Boolean, description: 'Boolean signifying if the appointment is cancelled or not' })
  cancelled: boolean;

  @ApiProperty({ type: Object, description: 'Service options chosen with this appointment service and their true values' })
  appointmentServiceOptions: AppointmentServiceOption[];

  @ApiProperty({ type: Object, description: 'The resources associated with the appointment' })
  appointmentServiceResources: AppointmentServiceResource[];

  @ApiProperty({ type: Object, description: 'A collection of appointment services' })
  appointmentServices: AppointmentServiceItem[];

  @ApiProperty({ type: String, description: 'Booked by type' })
  bookedByType: string;

  @ApiProperty({ type: Object, description: 'Links to allow direct addition of the appointment to different calendar platforms' })
  calendarLinks: CalendarLinks;

  @ApiPropertyOptional({ type: Object, description: 'Information about the cancellation, if present' })
  cancellation?: AppointmentCancellation | null;

  @ApiProperty({ type: Object, description: 'The client of the appointment' })
  client: AppointmentClientSummary;

  @ApiProperty({ type: String, description: 'The id of the client of the appointment' })
  clientId: string;

  @ApiPropertyOptional({ type: String, description: 'Message provided by the client' })
  clientMessage?: string | null;

  @ApiPropertyOptional({ type: Object, description: 'Custom field data wrapper' })
  custom?: Record<string, any> | null;

  @ApiProperty({ type: Object, description: 'Custom fields' })
  customFields: Record<string, any>[];

  @ApiProperty({ type: Number, description: 'The duration of the appointment' })
  duration: number;

  @ApiProperty({ type: Date, description: 'End time for the appointment' })
  endAt: Date;

  @ApiProperty({ type: Boolean, description: 'Indicates whether the appointment is part of a group appointment' })
  isGroupedAppointment: boolean;

  @ApiProperty({ type: Boolean, description: 'Indicates if the appointment belongs to a recurring series' })
  isRecurring: boolean;

  @ApiProperty({ type: Boolean, description: 'Indicates that the appointment is due to be carried out remotely' })
  isRemote: boolean;

  @ApiProperty({ type: Object, description: 'The Location where this appointment was booked' })
  location: BoulevardLocationSummary;

  @ApiProperty({ type: String, description: 'The Id of the Location where this appointment was booked' })
  locationId: string;

  @ApiProperty({ type: String, description: 'The URL at which a client can manage their own booking' })
  manageUrl: string;

  @ApiPropertyOptional({ type: String, description: 'Internal notes on the appointment' })
  notes?: string | null;

  @ApiProperty({ type: Boolean, description: 'Whether a notification email should have been sent to the client when the appointment was cancelled' })
  notifyClientCancel: boolean;

  @ApiProperty({ type: Boolean, description: 'Whether a notification email should have been sent to the client when the appointment was booked' })
  notifyClientCreate: boolean;

  @ApiPropertyOptional({ type: String, description: 'The id of the order that the appointment was checked out with' })
  orderId?: string | null;

  @ApiProperty({ type: Number, description: 'The total remaining forms that need to be completed for this appointment' })
  pendingFormCount: number;

  @ApiPropertyOptional({ type: Object, description: 'The rating for this appointment' })
  rating?: AppointmentRating | null;

  @ApiProperty({ type: Object, description: 'Options for joining a virtual meeting for this appointment' })
  remotePlatforms: RemotePlatforms;

  @ApiProperty({ type: String, description: 'The state of the appointment' })
  state: string;

  @ApiProperty({ type: Object, description: 'Tags that have been applied to the appointment' })
  tags: BoulevardTag[];
}
