import { Injectable } from '@nestjs/common';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftRepository } from './infrastructure/persistence/shift.repository';
import { Shift } from './domain/shift';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class ShiftService {
  constructor(private readonly repository: ShiftRepository) {}

  async create(dto: CreateShiftDto): Promise<Shift> {
    return this.repository.create({
      id: dto.id,
      available: dto.available,
      date: dto.date,
      endTime: dto.endTime,
      location: dto.location,
      locationId: dto.locationId ?? null,
      recurrence: dto.recurrence ?? null,
      staff: dto.staff,
      staffId: dto.staffId ?? null,
      startTime: dto.startTime,
      unavailableReason: dto.unavailableReason ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Shift[]; total: number }> {
    return this.repository.findManyWithPagination({ paginationOptions });
  }

  findById(id: Shift['id']): Promise<NullableType<Shift>> {
    return this.repository.findById(id);
  }

  findByStaffIdAndDateRange(staffId: string, startDate: string, endDate: string): Promise<Shift[]> {
    return this.repository.findByStaffIdAndDateRange(staffId, startDate, endDate);
  }

  findByStaffIdsAndDateRange(staffIds: string[], startDate: string, endDate: string): Promise<Shift[]> {
    return this.repository.findByStaffIdsAndDateRange(staffIds, startDate, endDate);
  }

  async update(id: Shift['id'], dto: UpdateShiftDto): Promise<Shift | null> {
    return this.repository.update(id, dto);
  }

  async remove(id: Shift['id']): Promise<void> {
    await this.repository.remove(id);
  }
}
