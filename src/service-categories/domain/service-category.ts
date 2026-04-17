import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ServiceCategory {
  @ApiProperty({ type: String, description: 'The ID of an object' })
  id: string;

  @ApiProperty({ type: String, description: 'Name' })
  name: string;

  @ApiProperty({ type: Boolean, description: 'Active' })
  active: boolean;

  @ApiProperty({ type: Date, description: 'The date and time when the service category was created' })
  createdAt: Date;

  @ApiProperty({ type: Date, description: 'The date and time when the service category was last updated' })
  updatedAt: Date;

  @ApiPropertyOptional({ type: Object, description: 'Services' })
  services?: Record<string, any> | null;

  @ApiPropertyOptional({ type: Object, description: 'Order which this service category is displayed alongside others' })
  sortPath?: string | null;
}
