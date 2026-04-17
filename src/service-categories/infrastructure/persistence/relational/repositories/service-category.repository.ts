import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategoryEntity } from '../entities/service-category.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { ServiceCategory } from '../../../../domain/service-category';
import { ServiceCategoryRepository } from '../../service-category.repository';
import { ServiceCategoryMapper } from '../mappers/service-category.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ServiceCategoryRelationalRepository implements ServiceCategoryRepository {
  constructor(
    @InjectRepository(ServiceCategoryEntity)
    private readonly repository: Repository<ServiceCategoryEntity>,
  ) {}

  async create(data: ServiceCategory): Promise<ServiceCategory> {
    const persistenceModel = ServiceCategoryMapper.toPersistence(data);
    const newEntity = await this.repository.save(this.repository.create(persistenceModel));
    return ServiceCategoryMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<{ data: ServiceCategory[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map((entity) => ServiceCategoryMapper.toDomain(entity)),
      total,
    };
  }

  async findById(id: ServiceCategory['id']): Promise<NullableType<ServiceCategory>> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? ServiceCategoryMapper.toDomain(entity) : null;
  }

  async update(id: ServiceCategory['id'], payload: Partial<ServiceCategory>): Promise<ServiceCategory> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('ServiceCategory not found');
    }

    const updatedEntity = await this.repository.save(
      this.repository.create(
        ServiceCategoryMapper.toPersistence({
          ...ServiceCategoryMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ServiceCategoryMapper.toDomain(updatedEntity);
  }

  async remove(id: ServiceCategory['id']): Promise<void> {
    await this.repository.delete(id);
  }
}
