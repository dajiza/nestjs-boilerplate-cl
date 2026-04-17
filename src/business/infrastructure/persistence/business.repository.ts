import { NullableType } from '../../../utils/types/nullable.type';
import { Business } from '../../domain/business';

export abstract class BusinessRepository {
  abstract create(data: Business): Promise<Business>;

  abstract findById(id: Business['id']): Promise<NullableType<Business>>;

  abstract findAll(): Promise<Business[]>;

  abstract update(id: Business['id'], payload: Partial<Business>): Promise<Business | null>;

  abstract remove(id: Business['id']): Promise<void>;
}
