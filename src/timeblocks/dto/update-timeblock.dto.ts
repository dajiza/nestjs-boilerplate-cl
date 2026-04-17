import { PartialType } from '@nestjs/swagger';
import { CreateTimeblockDto } from './create-timeblock.dto';

export class UpdateTimeblockDto extends PartialType(CreateTimeblockDto) {}
