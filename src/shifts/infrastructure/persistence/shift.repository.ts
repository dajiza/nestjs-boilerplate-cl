import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Shift } from '../../domain/shift';

export abstract class ShiftRepository {
  abstract create(data: Shift): Promise<Shift>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Shift[]; total: number }>;

  abstract findById(id: Shift['id']): Promise<NullableType<Shift>>;

  abstract findByStaffIdAndDateRange(staffId: string, startDate: string, endDate: string): Promise<Shift[]>;

  abstract findByStaffIdsAndDateRange(staffIds: string[], startDate: string, endDate: string): Promise<Shift[]>;

  abstract findByLocationId(locationId: string): Promise<Shift[]>;

  abstract update(id: Shift['id'], payload: Partial<Shift>): Promise<Shift | null>;

  abstract remove(id: Shift['id']): Promise<void>;
}
