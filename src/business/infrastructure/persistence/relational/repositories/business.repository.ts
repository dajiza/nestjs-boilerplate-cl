import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessEntity } from '../entities/business.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Business } from '../../../../domain/business';
import { BusinessRepository } from '../../business.repository';
import { BusinessMapper } from '../mappers/business.mapper';

@Injectable()
export class BusinessesRelationalRepository implements BusinessRepository {
  constructor(
    @InjectRepository(BusinessEntity)
    private readonly businessRepository: Repository<BusinessEntity>,
  ) {}

  async create(data: Business): Promise<Business> {
    const persistenceModel = BusinessMapper.toPersistence(data);
    const newEntity = await this.businessRepository.save(this.businessRepository.create(persistenceModel));
    return BusinessMapper.toDomain(newEntity);
  }

  async findById(id: Business['id']): Promise<NullableType<Business>> {
    const entity = await this.businessRepository.findOne({
      where: { id },
    });

    return entity ? BusinessMapper.toDomain(entity) : null;
  }

  async findAll(): Promise<Business[]> {
    const entities = await this.businessRepository.find();
    return entities.map((entity) => BusinessMapper.toDomain(entity));
  }

  async update(id: Business['id'], payload: Partial<Business>): Promise<Business> {
    const entity = await this.businessRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Business not found');
    }

    const updatedEntity = await this.businessRepository.save(
      this.businessRepository.create(
        BusinessMapper.toPersistence({
          ...BusinessMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return BusinessMapper.toDomain(updatedEntity);
  }

  async remove(id: Business['id']): Promise<void> {
    await this.businessRepository.delete(id);
  }
}
