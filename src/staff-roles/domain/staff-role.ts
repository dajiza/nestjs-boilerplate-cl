import { ApiProperty } from '@nestjs/swagger';

export class StaffRole {
  @ApiProperty({ type: String, description: 'The ID of the staff role' })
  id: string;

  @ApiProperty({ type: String, description: 'Name of the role' })
  name: string;
}
