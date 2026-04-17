import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStaffRoleDto {
  @ApiProperty({ type: String, description: 'The ID of the staff role' })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({ type: String, description: 'Name of the role' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
