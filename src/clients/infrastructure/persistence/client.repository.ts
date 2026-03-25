import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Client } from '../../domain/client';

export abstract class ClientRepository {
  abstract create(data: Client): Promise<Client>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Client[]; total: number }>;

  abstract findById(id: Client['id']): Promise<NullableType<Client>>;

  abstract findByEmail(email: Client['email']): Promise<NullableType<Client>>;

  abstract update(id: Client['id'], payload: Partial<Client>): Promise<Client | null>;

  abstract remove(id: Client['id']): Promise<void>;
}
