import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class RemoveTagsDto {
  @ApiProperty({ type: [String], description: '要移除的 tag ID 列表' })
  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
}
