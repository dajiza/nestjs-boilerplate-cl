import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from '../entities/location.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Location } from '../../../../domain/location';
import { LocationRepository } from '../../location.repository';
import { LocationMapper } from '../mappers/location.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class LocationRelationalRepository implements LocationRepository {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repository: Repository<LocationEntity>,
  ) {}

  async create(data: Location): Promise<Location> {
    const persistenceModel = LocationMapper.toPersistence(data);
    const newEntity = await this.repository.save(this.repository.create(persistenceModel));
    return LocationMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Location[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { name: 'ASC' },
    });

    return {
      data: entities.map((entity) => LocationMapper.toDomain(entity)),
      total,
    };
  }

  async findById(id: Location['id']): Promise<NullableType<Location>> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? LocationMapper.toDomain(entity) : null;
  }

  async update(id: Location['id'], payload: Partial<Location>): Promise<Location> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Location not found');
    }

    const updatedEntity = await this.repository.save(
      this.repository.create(
        LocationMapper.toPersistence({
          ...LocationMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return LocationMapper.toDomain(updatedEntity);
  }

  async remove(id: Location['id']): Promise<void> {
    await this.repository.delete(id);
  }
}
