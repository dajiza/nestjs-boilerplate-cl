import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Location } from '../../domain/location';

export abstract class LocationRepository {
  abstract create(data: Location): Promise<Location>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Location[]; total: number }>;

  abstract findById(id: Location['id']): Promise<NullableType<Location>>;

  abstract update(id: Location['id'], payload: Partial<Location>): Promise<Location | null>;

  abstract remove(id: Location['id']): Promise<void>;
}
