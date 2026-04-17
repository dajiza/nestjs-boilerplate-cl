import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { ShiftEntity } from '../entities/shift.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Shift } from '../../../../domain/shift';
import { ShiftRepository } from '../../shift.repository';
import { ShiftMapper } from '../mappers/shift.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ShiftRelationalRepository implements ShiftRepository {
  constructor(
    @InjectRepository(ShiftEntity)
    private readonly repository: Repository<ShiftEntity>,
  ) {}

  async create(data: Shift): Promise<Shift> {
    const persistenceModel = ShiftMapper.toPersistence(data);
    const newEntity = await this.repository.save(this.repository.create(persistenceModel));
    return ShiftMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Shift[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { date: 'ASC' },
    });

    return {
      data: entities.map((entity) => ShiftMapper.toDomain(entity)),
      total,
    };
  }

  async findById(id: Shift['id']): Promise<NullableType<Shift>> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? ShiftMapper.toDomain(entity) : null;
  }

  async findByStaffIdAndDateRange(staffId: string, startDate: string, endDate: string): Promise<Shift[]> {
    const entities = await this.repository.find({
      where: {
        staffId,
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });

    return entities.map((entity) => ShiftMapper.toDomain(entity));
  }

  async findByStaffIdsAndDateRange(staffIds: string[], startDate: string, endDate: string): Promise<Shift[]> {
    if (!staffIds.length) return [];

    const entities = await this.repository.find({
      where: {
        staffId: In(staffIds),
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });

    return entities.map((entity) => ShiftMapper.toDomain(entity));
  }

  async findByLocationId(locationId: string): Promise<Shift[]> {
    const entities = await this.repository.find({
      where: { locationId },
      order: { date: 'ASC' },
    });

    return entities.map((entity) => ShiftMapper.toDomain(entity));
  }

  async update(id: Shift['id'], payload: Partial<Shift>): Promise<Shift> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Shift not found');
    }

    const updatedEntity = await this.repository.save(
      this.repository.create(
        ShiftMapper.toPersistence({
          ...ShiftMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ShiftMapper.toDomain(updatedEntity);
  }

  async remove(id: Shift['id']): Promise<void> {
    await this.repository.delete(id);
  }
}
