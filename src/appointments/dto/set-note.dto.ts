import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SetNoteDto {
  @ApiPropertyOptional({ description: '预约备注，传 null 清除' })
  @IsOptional()
  @IsString()
  note?: string | null;
}
