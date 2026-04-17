import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { StaffRole } from '../../domain/staff-role';

export abstract class StaffRoleRepository {
  abstract create(data: StaffRole): Promise<StaffRole>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: StaffRole[]; total: number }>;

  abstract findById(id: StaffRole['id']): Promise<NullableType<StaffRole>>;

  abstract update(id: StaffRole['id'], payload: Partial<StaffRole>): Promise<StaffRole | null>;

  abstract remove(id: StaffRole['id']): Promise<void>;
}
