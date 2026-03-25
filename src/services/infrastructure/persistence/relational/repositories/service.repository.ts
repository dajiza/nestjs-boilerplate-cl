import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entities/service.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Service } from '../../../../domain/service';
import { ServiceRepository } from '../../service.repository';
import { ServiceMapper } from '../mappers/service.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ServiceRelationalRepository implements ServiceRepository {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async create(data: Service): Promise<Service> {
    const persistenceModel = ServiceMapper.toPersistence(data);
    const newEntity = await this.serviceRepository.save(this.serviceRepository.create(persistenceModel));
    return ServiceMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Service[]; total: number }> {
    const [entities, total] = await this.serviceRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map((service) => ServiceMapper.toDomain(service)),
      total,
    };
  }

  async findById(id: Service['id']): Promise<NullableType<Service>> {
    const entity = await this.serviceRepository.findOne({
      where: { id },
    });

    return entity ? ServiceMapper.toDomain(entity) : null;
  }

  async update(id: Service['id'], payload: Partial<Service>): Promise<Service> {
    const entity = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Service not found');
    }

    const updatedEntity = await this.serviceRepository.save(
      this.serviceRepository.create(
        ServiceMapper.toPersistence({
          ...ServiceMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ServiceMapper.toDomain(updatedEntity);
  }

  async remove(id: Service['id']): Promise<void> {
    await this.serviceRepository.delete(id);
  }
}
