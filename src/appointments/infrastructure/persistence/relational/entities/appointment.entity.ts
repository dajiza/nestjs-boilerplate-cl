import { Column, Entity, Index, PrimaryColumn } from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';
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
} from '../../../../../utils/types/boulevard.types';

@Entity({
  name: 'appointment',
})
export class AppointmentEntity extends EntityRelationalHelper {
  @PrimaryColumn({ type: 'varchar', length: 255, comment: 'The ID of an object' })
  id: string;

  @Column({ type: 'jsonb', comment: 'Service options chosen with this appointment service and their true values' })
  appointmentServiceOptions: AppointmentServiceOption[];

  @Column({ type: 'jsonb', comment: 'The resources associated with the appointment' })
  appointmentServiceResources: AppointmentServiceResource[];

  @Column({ type: 'jsonb', comment: 'A collection of appointment services' })
  appointmentServices: AppointmentServiceItem[];

  @Column({ type: 'varchar', length: 50, comment: 'Booked by type' })
  bookedByType: string;

  @Column({ type: 'jsonb', comment: 'Links to allow direct addition of the appointment to different calendar platforms' })
  calendarLinks: CalendarLinks;

  @Column({ type: 'jsonb', nullable: true, comment: 'Information about the cancellation, if present' })
  cancellation: AppointmentCancellation | null;

  @Column({ type: 'boolean', comment: 'Boolean signifying if the appointment is cancelled or not' })
  cancelled: boolean;

  @Column({ type: 'jsonb', comment: 'The client of the appointment' })
  client: AppointmentClientSummary;

  @Index()
  @Column({ type: 'varchar', length: 255, comment: 'The id of the client of the appointment' })
  clientId: string;

  @Column({ type: 'text', nullable: true, comment: 'Message provided by the client' })
  clientMessage: string | null;

  @Column({ type: 'timestamp', comment: 'When the appointment was created (in Etc/UTC)' })
  createdAt: Date;

  @Column({ type: 'jsonb', nullable: true, comment: 'Custom field data wrapper' })
  custom: Record<string, any> | null;

  @Column({ type: 'jsonb', comment: 'Custom fields' })
  customFields: Record<string, any>[];

  @Column({ type: 'int', comment: 'The duration of the appointment' })
  duration: number;

  @Column({ type: 'timestamp', comment: 'End time for the appointment' })
  endAt: Date;

  @Column({ type: 'boolean', comment: 'Indicates whether the appointment is part of a group appointment' })
  isGroupedAppointment: boolean;

  @Column({ type: 'boolean', comment: 'Indicates if the appointment belongs to a recurring series' })
  isRecurring: boolean;

  @Column({ type: 'boolean', comment: 'Indicates that the appointment is due to be carried out remotely' })
  isRemote: boolean;

  @Column({ type: 'jsonb', comment: 'The Location where this appointment was booked' })
  location: BoulevardLocationSummary;

  @Index()
  @Column({ type: 'varchar', length: 255, comment: 'The Id of the Location where this appointment was booked' })
  locationId: string;

  @Column({ type: 'text', comment: 'The URL at which a client can manage their own booking' })
  manageUrl: string;

  @Column({ type: 'text', nullable: true, comment: 'Internal notes on the appointment' })
  notes: string | null;

  @Column({ type: 'boolean', comment: 'Whether a notification email should have been sent to the client when the appointment was cancelled' })
  notifyClientCancel: boolean;

  @Column({ type: 'boolean', comment: 'Whether a notification email should have been sent to the client when the appointment was booked' })
  notifyClientCreate: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: 'The id of the order that the appointment was checked out with' })
  orderId: string | null;

  @Column({ type: 'int', comment: 'The total remaining forms that need to be completed for this appointment' })
  pendingFormCount: number;

  @Column({ type: 'jsonb', nullable: true, comment: 'The rating for this appointment' })
  rating: AppointmentRating | null;

  @Column({ type: 'jsonb', comment: 'Options for joining a virtual meeting for this appointment' })
  remotePlatforms: RemotePlatforms;

  @Index()
  @Column({ type: 'timestamp', comment: 'Start time for the appointment' })
  startAt: Date;

  @Column({ type: 'varchar', length: 50, comment: 'The state of the appointment' })
  state: string;

  @Column({ type: 'jsonb', comment: 'Tags that have been applied to the appointment' })
  tags: BoulevardTag[];
}
