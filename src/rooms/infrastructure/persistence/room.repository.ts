import { Room } from '../../domain/room';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';

export abstract class RoomRepository {
  abstract create(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Room[]; total: number }>;

  abstract findById(id: string): Promise<NullableType<Room>>;

  abstract findByServiceId(serviceId: string): Promise<Room[]>;

  abstract update(id: string, payload: Partial<Room>): Promise<Room>;

  abstract remove(id: string): Promise<void>;
}
