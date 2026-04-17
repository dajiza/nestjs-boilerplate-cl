import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AddTagsDto {
  @ApiProperty({ type: [String], description: '要添加的 tag ID 列表' })
  @IsArray()
  @IsString({ each: true })
  tagIds: string[];
}
