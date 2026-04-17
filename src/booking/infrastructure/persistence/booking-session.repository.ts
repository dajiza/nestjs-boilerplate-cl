import { NullableType } from '../../../utils/types/nullable.type';
import { BookingSession } from '../../domain/booking-session';

export abstract class BookingSessionRepository {
  abstract create(data: BookingSession): Promise<BookingSession>;
  abstract findById(id: string): Promise<NullableType<BookingSession>>;
  abstract update(id: string, payload: Partial<BookingSession>): Promise<BookingSession | null>;
  abstract remove(id: string): Promise<void>;
  abstract cleanExpired(): Promise<number>;
}
