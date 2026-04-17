import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Timeblock } from '../../domain/timeblock';

export abstract class TimeblockRepository {
  abstract create(data: Timeblock): Promise<Timeblock>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Timeblock[]; total: number }>;

  abstract findById(id: Timeblock['id']): Promise<NullableType<Timeblock>>;

  abstract findByStaffIdAndDateRange(staffId: string, startDate: Date, endDate: Date): Promise<Timeblock[]>;

  abstract findByStaffIdsAndDateRange(staffIds: string[], startDate: Date, endDate: Date): Promise<Timeblock[]>;

  abstract update(id: Timeblock['id'], payload: Partial<Timeblock>): Promise<Timeblock | null>;

  abstract remove(id: Timeblock['id']): Promise<void>;
}
