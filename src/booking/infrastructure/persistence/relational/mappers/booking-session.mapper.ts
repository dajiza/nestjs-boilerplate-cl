import { BookingSessionEntity } from '../entities/booking-session.entity';
import { BookingSession } from '../../../../domain/booking-session';

export class BookingSessionMapper {
  static toDomain(entity: BookingSessionEntity): BookingSession {
    const session = new BookingSession();
    session.id = entity.id;
    session.locationId = entity.locationId;
    session.clientId = entity.clientId;
    session.state = entity.state as any;
    session.services = (entity.services as any[]) || [];
    session.startAt = entity.startAt;
    session.notes = entity.notes;
    session.clientMessage = entity.clientMessage;
    session.expiresAt = entity.expiresAt;
    session.createdAt = entity.createdAt;
    session.updatedAt = entity.updatedAt;
    return session;
  }

  static toPersistence(domain: BookingSession): Partial<BookingSessionEntity> {
    return {
      id: domain.id,
      locationId: domain.locationId,
      clientId: domain.clientId,
      state: domain.state,
      services: domain.services as any[],
      startAt: domain.startAt,
      notes: domain.notes,
      clientMessage: domain.clientMessage,
      expiresAt: domain.expiresAt,
    };
  }
}
