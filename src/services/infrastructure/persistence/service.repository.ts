import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Service } from '../../domain/service';

export abstract class ServiceRepository {
  abstract create(data: Service): Promise<Service>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Service[]; total: number }>;

  abstract findById(id: Service['id']): Promise<NullableType<Service>>;

  abstract update(id: Service['id'], payload: Partial<Service>): Promise<Service | null>;

  abstract remove(id: Service['id']): Promise<void>;
}
