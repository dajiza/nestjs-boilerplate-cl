import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface CalComBookingAttendee {
  name: string;
  email: string;
  timeZone: string;
}

export interface CalComBookingResponse {
  id: number;
  uid: string;
  status: string;
  start: string;
  end: string;
}

@Injectable()
export class CalComService {
  private readonly logger = new Logger(CalComService.name);
  private readonly apiKey: string;
  private readonly eventTypeId: string;
  private readonly eventTypeSlug: string;
  private readonly username: string;
  private readonly baseUrl = 'https://api.cal.com/v2';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('CAL_COM_API_KEY', { infer: true }) || '';
    this.eventTypeId = this.configService.get<string>('CAL_COM_EVENT_TYPE_ID', { infer: true }) || '';
    this.eventTypeSlug = this.configService.get<string>('CAL_COM_EVENT_TYPE_SLUG', { infer: true }) || '';
    this.username = this.configService.get<string>('CAL_COM_USERNAME', { infer: true }) || '';
  }

  async createBooking(params: {
    start: Date;
    end: Date;
    attendee: CalComBookingAttendee;
    notes?: string;
    metadata?: Record<string, any>;
  }): Promise<CalComBookingResponse | null> {
    if (!this.apiKey) {
      this.logger.warn('Cal.com API key not configured, skipping booking creation');
      return null;
    }

    // Check if we have valid event type configuration
    const hasEventTypeId = this.eventTypeId && !isNaN(Number(this.eventTypeId));
    const hasSlugWithUsername = this.eventTypeSlug && this.username;

    if (!hasEventTypeId && !hasSlugWithUsername) {
      this.logger.warn('Cal.com Event Type ID or (Event Type Slug + Username) not configured, skipping booking creation');
      return null;
    }

    const requestBody: Record<string, any> = {
      start: params.start.toISOString(),
      attendee: {
        name: params.attendee.name,
        email: params.attendee.email,
        timeZone: params.attendee.timeZone,
      },
      notes: params.notes,
      metadata: params.metadata,
    };

    // Use eventTypeId if available, otherwise use slug + username
    if (hasEventTypeId) {
      requestBody.eventTypeId = Number(this.eventTypeId);
    } else {
      requestBody.eventTypeSlug = this.eventTypeSlug;
      requestBody.username = this.username;
    }

    try {
      const response = await fetch(`${this.baseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'cal-api-version': '2026-02-25',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Failed to create Cal.com booking: ${response.status} ${errorText}`);
        return null;
      }

      const data = await response.json();
      this.logger.log(`Created Cal.com booking: ${data.data.uid}`);
      return data.data;
    } catch (error) {
      this.logger.error(`Error creating Cal.com booking: ${error}`);
      return null;
    }
  }

  async updateBooking(params: { bookingUid: string; start?: Date; notes?: string }): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.warn('Cal.com API key not configured, skipping booking update');
      return false;
    }

    try {
      const body: Record<string, any> = {};
      if (params.start) {
        body.start = params.start.toISOString();
      }
      if (params.notes !== undefined) {
        body.notes = params.notes;
      }

      const response = await fetch(`${this.baseUrl}/bookings/${params.bookingUid}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'cal-api-version': '2026-02-25',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Failed to update Cal.com booking: ${response.status} ${errorText}`);
        return false;
      }

      this.logger.log(`Updated Cal.com booking: ${params.bookingUid}`);
      return true;
    } catch (error) {
      this.logger.error(`Error updating Cal.com booking: ${error}`);
      return false;
    }
  }

  async cancelBooking(bookingUid: string): Promise<boolean> {
    if (!this.apiKey) {
      this.logger.warn('Cal.com API key not configured, skipping booking cancellation');
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}/bookings/${bookingUid}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          'cal-api-version': '2026-02-25',
        },
        body: JSON.stringify({
          cancellationReason: 'Cancelled from application',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Failed to cancel Cal.com booking: ${response.status} ${errorText}`);
        return false;
      }

      this.logger.log(`Cancelled Cal.com booking: ${bookingUid}`);
      return true;
    } catch (error) {
      this.logger.error(`Error cancelling Cal.com booking: ${error}`);
      return false;
    }
  }
}
