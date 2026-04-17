import { Injectable } from '@nestjs/common';
import { CreateTimeblockDto } from './dto/create-timeblock.dto';
import { UpdateTimeblockDto } from './dto/update-timeblock.dto';
import { TimeblockRepository } from './infrastructure/persistence/timeblock.repository';
import { Timeblock } from './domain/timeblock';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class TimeblockService {
  constructor(private readonly repository: TimeblockRepository) {}

  async create(dto: CreateTimeblockDto): Promise<Timeblock> {
    return this.repository.create({
      id: dto.id,
      cancelled: dto.cancelled ?? null,
      duration: dto.duration,
      endAt: new Date(dto.endAt),
      location: dto.location,
      reason: dto.reason ?? null,
      staff: dto.staff,
      staffId: dto.staffId,
      startAt: new Date(dto.startAt),
      title: dto.title ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Timeblock[]; total: number }> {
    return this.repository.findManyWithPagination({ paginationOptions });
  }

  findById(id: Timeblock['id']): Promise<NullableType<Timeblock>> {
    return this.repository.findById(id);
  }

  findByStaffIdAndDateRange(staffId: string, startDate: Date, endDate: Date): Promise<Timeblock[]> {
    return this.repository.findByStaffIdAndDateRange(staffId, startDate, endDate);
  }

  findByStaffIdsAndDateRange(staffIds: string[], startDate: Date, endDate: Date): Promise<Timeblock[]> {
    return this.repository.findByStaffIdsAndDateRange(staffIds, startDate, endDate);
  }

  async update(id: Timeblock['id'], dto: UpdateTimeblockDto): Promise<Timeblock | null> {
    return this.repository.update(id, {
      ...dto,
      startAt: dto.startAt ? new Date(dto.startAt) : undefined,
      endAt: dto.endAt ? new Date(dto.endAt) : undefined,
    });
  }

  async remove(id: Timeblock['id']): Promise<void> {
    await this.repository.remove(id);
  }
}
