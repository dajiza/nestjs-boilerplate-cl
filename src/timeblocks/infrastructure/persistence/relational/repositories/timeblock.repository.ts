import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { TimeblockEntity } from '../entities/timeblock.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Timeblock } from '../../../../domain/timeblock';
import { TimeblockRepository } from '../../timeblock.repository';
import { TimeblockMapper } from '../mappers/timeblock.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class TimeblockRelationalRepository implements TimeblockRepository {
  constructor(
    @InjectRepository(TimeblockEntity)
    private readonly repository: Repository<TimeblockEntity>,
  ) {}

  async create(data: Timeblock): Promise<Timeblock> {
    const persistenceModel = TimeblockMapper.toPersistence(data);
    const newEntity = await this.repository.save(this.repository.create(persistenceModel));
    return TimeblockMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Timeblock[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { startAt: 'ASC' },
    });

    return {
      data: entities.map((entity) => TimeblockMapper.toDomain(entity)),
      total,
    };
  }

  async findById(id: Timeblock['id']): Promise<NullableType<Timeblock>> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? TimeblockMapper.toDomain(entity) : null;
  }

  async findByStaffIdAndDateRange(staffId: string, startDate: Date, endDate: Date): Promise<Timeblock[]> {
    const entities = await this.repository.find({
      where: {
        staffId,
        startAt: Between(startDate, endDate),
      },
      order: { startAt: 'ASC' },
    });

    return entities.map((entity) => TimeblockMapper.toDomain(entity));
  }

  async findByStaffIdsAndDateRange(staffIds: string[], startDate: Date, endDate: Date): Promise<Timeblock[]> {
    if (!staffIds.length) return [];

    const entities = await this.repository.find({
      where: {
        staffId: In(staffIds),
        startAt: Between(startDate, endDate),
      },
      order: { startAt: 'ASC' },
    });

    return entities.map((entity) => TimeblockMapper.toDomain(entity));
  }

  async update(id: Timeblock['id'], payload: Partial<Timeblock>): Promise<Timeblock> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Timeblock not found');
    }

    const updatedEntity = await this.repository.save(
      this.repository.create(
        TimeblockMapper.toPersistence({
          ...TimeblockMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return TimeblockMapper.toDomain(updatedEntity);
  }

  async remove(id: Timeblock['id']): Promise<void> {
    await this.repository.delete(id);
  }
}
