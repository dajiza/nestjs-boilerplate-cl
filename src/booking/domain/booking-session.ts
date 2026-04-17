import { BookingSessionState } from './booking-session-state';

export class BookingSession {
  id: string;
  locationId: string;
  clientId: string | null;
  state: BookingSessionState;
  services: BookingSessionService[];
  startAt: Date | null;
  notes: string | null;
  clientMessage: string | null;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingSessionService {
  serviceId: string;
  staffId: string | null;
  startTimeOffset: number; // minutes from booking startAt
  resources?: Record<string, any>[];
}
