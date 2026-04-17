import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingSessionState } from '../domain/booking-session-state';

export class BookingSessionDto {
  @ApiProperty() id: string;
  @ApiProperty() locationId: string;
  @ApiPropertyOptional() clientId: string | null;
  @ApiProperty({ enum: BookingSessionState }) state: BookingSessionState;
  @ApiPropertyOptional() services: Record<string, any>[];
  @ApiPropertyOptional() startAt: string | null;
  @ApiPropertyOptional() notes: string | null;
  @ApiPropertyOptional() clientMessage: string | null;
  @ApiProperty() expiresAt: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
