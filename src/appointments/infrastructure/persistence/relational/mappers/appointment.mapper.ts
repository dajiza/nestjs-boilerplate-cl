import { Appointment } from '../../../../domain/appointment';
import { AppointmentEntity } from '../entities/appointment.entity';

export class AppointmentMapper {
  static toDomain(raw: AppointmentEntity): Appointment {
    const domainEntity = new Appointment();
    domainEntity.id = raw.id;
    domainEntity.startAt = raw.startAt;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.cancelled = raw.cancelled;
    domainEntity.staffId = raw.staffId;
    domainEntity.appointmentServiceOptions = raw.appointmentServiceOptions;
    domainEntity.appointmentServiceResources = raw.appointmentServiceResources;
    domainEntity.appointmentServices = raw.appointmentServices;
    domainEntity.bookedByType = raw.bookedByType;
    domainEntity.calendarLinks = raw.calendarLinks;
    domainEntity.cancellation = raw.cancellation;
    domainEntity.client = raw.client;
    domainEntity.clientId = raw.clientId;
    domainEntity.clientMessage = raw.clientMessage;
    domainEntity.custom = raw.custom;
    domainEntity.customFields = raw.customFields;
    domainEntity.keys = raw.keys;
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
    domainEntity.state = raw.state;
    domainEntity.tags = raw.tags;
    domainEntity.roomId = raw.roomId;
    domainEntity.equipmentId = raw.equipmentId;
    domainEntity.calComBookingId = raw.calComBookingId;
    return domainEntity;
  }

  static toPersistence(domainEntity: Appointment): AppointmentEntity {
    const persistenceEntity = new AppointmentEntity();
    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.startAt = domainEntity.startAt;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.cancelled = domainEntity.cancelled;
    persistenceEntity.staffId = domainEntity.staffId;
    persistenceEntity.appointmentServiceOptions = domainEntity.appointmentServiceOptions ?? null;
    persistenceEntity.appointmentServiceResources = domainEntity.appointmentServiceResources ?? null;
    persistenceEntity.appointmentServices = domainEntity.appointmentServices ?? null;
    persistenceEntity.bookedByType = domainEntity.bookedByType ?? null;
    persistenceEntity.calendarLinks = domainEntity.calendarLinks ?? null;
    persistenceEntity.cancellation = domainEntity.cancellation ?? null;
    persistenceEntity.client = domainEntity.client ?? null;
    persistenceEntity.clientId = domainEntity.clientId ?? null;
    persistenceEntity.clientMessage = domainEntity.clientMessage ?? null;
    persistenceEntity.custom = domainEntity.custom ?? null;
    persistenceEntity.customFields = domainEntity.customFields ?? null;
    persistenceEntity.keys = domainEntity.keys ?? null;
    persistenceEntity.duration = domainEntity.duration ?? null;
    persistenceEntity.endAt = domainEntity.endAt ?? null;
    persistenceEntity.isGroupedAppointment = domainEntity.isGroupedAppointment ?? null;
    persistenceEntity.isRecurring = domainEntity.isRecurring ?? null;
    persistenceEntity.isRemote = domainEntity.isRemote ?? null;
    persistenceEntity.location = domainEntity.location ?? null;
    persistenceEntity.locationId = domainEntity.locationId ?? null;
    persistenceEntity.manageUrl = domainEntity.manageUrl ?? null;
    persistenceEntity.notes = domainEntity.notes ?? null;
    persistenceEntity.notifyClientCancel = domainEntity.notifyClientCancel ?? null;
    persistenceEntity.notifyClientCreate = domainEntity.notifyClientCreate ?? null;
    persistenceEntity.orderId = domainEntity.orderId ?? null;
    persistenceEntity.pendingFormCount = domainEntity.pendingFormCount ?? null;
    persistenceEntity.rating = domainEntity.rating ?? null;
    persistenceEntity.remotePlatforms = domainEntity.remotePlatforms ?? null;
    persistenceEntity.state = domainEntity.state ?? null;
    persistenceEntity.tags = domainEntity.tags ?? null;
    persistenceEntity.roomId = domainEntity.roomId ?? null;
    persistenceEntity.equipmentId = domainEntity.equipmentId ?? null;
    persistenceEntity.calComBookingId = domainEntity.calComBookingId ?? null;
    return persistenceEntity;
  }
}
