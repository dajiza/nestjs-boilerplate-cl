import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { ServiceCategory } from '../../domain/service-category';

export abstract class ServiceCategoryRepository {
  abstract create(data: ServiceCategory): Promise<ServiceCategory>;

  abstract findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: ServiceCategory[]; total: number }>;

  abstract findById(id: ServiceCategory['id']): Promise<NullableType<ServiceCategory>>;

  abstract update(id: ServiceCategory['id'], payload: Partial<ServiceCategory>): Promise<ServiceCategory | null>;

  abstract remove(id: ServiceCategory['id']): Promise<void>;
}
