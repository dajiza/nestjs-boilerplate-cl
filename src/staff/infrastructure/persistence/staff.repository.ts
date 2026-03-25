import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Staff } from '../../domain/staff';

export abstract class StaffRepository {
  abstract create(data: Staff): Promise<Staff>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Staff[]; total: number }>;

  abstract findById(id: Staff['id']): Promise<NullableType<Staff>>;

  abstract findByEmail(email: Staff['email']): Promise<NullableType<Staff>>;

  abstract update(id: Staff['id'], payload: Partial<Staff>): Promise<Staff | null>;

  abstract remove(id: Staff['id']): Promise<void>;
}
