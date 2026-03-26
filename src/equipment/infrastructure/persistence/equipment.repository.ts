import { Equipment } from '../../domain/equipment';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class EquipmentRepository {
  abstract create(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Equipment>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Equipment[]; total: number }>;

  abstract findById(id: string): Promise<NullableType<Equipment>>;

  abstract findByServiceId(serviceId: string): Promise<Equipment[]>;

  abstract update(id: string, payload: Partial<Equipment>): Promise<Equipment>;

  abstract remove(id: string): Promise<void>;
}
