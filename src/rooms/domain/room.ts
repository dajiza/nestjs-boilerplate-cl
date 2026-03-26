import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Room {
  @ApiPropertyOptional({
    type: String,
    description: 'Room ID (auto-generated UUID)',
  })
  id?: string;

  @ApiProperty({
    type: String,
    description: 'Room name',
  })
  name: string;

  @ApiPropertyOptional({
    type: String,
    description: 'Service ID this room belongs to',
  })
  serviceId?: string | null;

  @ApiPropertyOptional({
    type: Date,
    description: 'Created at',
  })
  createdAt?: Date;

  @ApiPropertyOptional({
    type: Date,
    description: 'Updated at',
  })
  updatedAt?: Date;
}
