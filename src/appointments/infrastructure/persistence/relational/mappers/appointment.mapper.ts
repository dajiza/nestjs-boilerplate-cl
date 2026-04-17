import { Appointment } from '../../../../domain/appointment';
import { AppointmentEntity } from '../entities/appointment.entity';

export class AppointmentMapper {
  static toDomain(raw: AppointmentEntity): Appointment {
    const domainEntity = new Appointment();
    domainEntity.id = raw.id;
    domainEntity.appointmentServiceOptions = raw.appointmentServiceOptions;
    domainEntity.appointmentServiceResources = raw.appointmentServiceResources;
    domainEntity.appointmentServices = raw.appointmentServices;
    domainEntity.bookedByType = raw.bookedByType;
    domainEntity.calendarLinks = raw.calendarLinks;
    domainEntity.cancellation = raw.cancellation;
    domainEntity.cancelled = raw.cancelled;
    domainEntity.client = raw.client;
    domainEntity.clientId = raw.clientId;
    domainEntity.clientMessage = raw.clientMessage;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.custom = raw.custom;
    domainEntity.customFields = raw.customFields;
    domainEntity.duration = raw.duration;
    domainEntity.endAt = raw.endAt;
    domainEntity.isGroupedAppointment = raw.isGroupedAppointment;
    domainEntity.isRecurring = raw.isRecurring;
    domainEntity.isRemote = raw.isRemote;
    domainEntity.location = raw.location;
    domainEntity.locationId = raw.locationId;
    domainEntity.manageUrl = raw.manageUrl;
    domainEntity.notes = raw.notes;
    domainEntity.notifyClientCancel = raw.notifyClientCancel;
    domainEntity.notifyClientCreate = raw.notifyClientCreate;
    domainEntity.orderId = raw.orderId;
    domainEntity.pendingFormCount = raw.pendingFormCount;
    domainEntity.rating = raw.rating;
    domainEntity.remotePlatforms = raw.remotePlatforms;
    domainEntity.startAt = raw.startAt;
    domainEntity.state = raw.state;
    domainEntity.tags = raw.tags;
    return domainEntity;
  }

  static toPersistence(domainEntity: Appointment): AppointmentEntity {
    const persistenceEntity = new AppointmentEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.appointmentServiceOptions = domainEntity.appointmentServiceOptions;
    persistenceEntity.appointmentServiceResources = domainEntity.appointmentServiceResources;
    persistenceEntity.appointmentServices = domainEntity.appointmentServices;
    persistenceEntity.bookedByType = domainEntity.bookedByType;
    persistenceEntity.calendarLinks = domainEntity.calendarLinks;
    persistenceEntity.cancellation = domainEntity.cancellation ?? null;
    persistenceEntity.cancelled = domainEntity.cancelled;
    persistenceEntity.client = domainEntity.client;
    persistenceEntity.clientId = domainEntity.clientId;
    persistenceEntity.clientMessage = domainEntity.clientMessage ?? null;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.custom = domainEntity.custom ?? null;
    persistenceEntity.customFields = domainEntity.customFields;
    persistenceEntity.duration = domainEntity.duration;
    persistenceEntity.endAt = domainEntity.endAt;
    persistenceEntity.isGroupedAppointment = domainEntity.isGroupedAppointment;
    persistenceEntity.isRecurring = domainEntity.isRecurring;
    persistenceEntity.isRemote = domainEntity.isRemote;
    persistenceEntity.location = domainEntity.location;
    persistenceEntity.locationId = domainEntity.locationId;
    persistenceEntity.manageUrl = domainEntity.manageUrl;
    persistenceEntity.notes = domainEntity.notes ?? null;
    persistenceEntity.notifyClientCancel = domainEntity.notifyClientCancel;
    persistenceEntity.notifyClientCreate = domainEntity.notifyClientCreate;
    persistenceEntity.orderId = domainEntity.orderId ?? null;
    persistenceEntity.pendingFormCount = domainEntity.pendingFormCount;
    persistenceEntity.rating = domainEntity.rating ?? null;
    persistenceEntity.remotePlatforms = domainEntity.remotePlatforms;
    persistenceEntity.startAt = domainEntity.startAt;
    persistenceEntity.state = domainEntity.state;
    persistenceEntity.tags = domainEntity.tags;
    return persistenceEntity;
  }
}
