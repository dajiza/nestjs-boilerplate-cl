import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StaffRoleEntity } from '../entities/staff-role.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { StaffRole } from '../../../../domain/staff-role';
import { StaffRoleRepository } from '../../staff-role.repository';
import { StaffRoleMapper } from '../mappers/staff-role.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class StaffRoleRelationalRepository implements StaffRoleRepository {
  constructor(
    @InjectRepository(StaffRoleEntity)
    private readonly repository: Repository<StaffRoleEntity>,
  ) {}

  async create(data: StaffRole): Promise<StaffRole> {
    const persistenceModel = StaffRoleMapper.toPersistence(data);
    const newEntity = await this.repository.save(this.repository.create(persistenceModel));
    return StaffRoleMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: StaffRole[]; total: number }> {
    const [entities, total] = await this.repository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { name: 'ASC' },
    });

    return {
      data: entities.map((entity) => StaffRoleMapper.toDomain(entity)),
      total,
    };
  }

  async findById(id: StaffRole['id']): Promise<NullableType<StaffRole>> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? StaffRoleMapper.toDomain(entity) : null;
  }

  async update(id: StaffRole['id'], payload: Partial<StaffRole>): Promise<StaffRole> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('StaffRole not found');
    }

    const updatedEntity = await this.repository.save(
      this.repository.create(
        StaffRoleMapper.toPersistence({
          ...StaffRoleMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return StaffRoleMapper.toDomain(updatedEntity);
  }

  async remove(id: StaffRole['id']): Promise<void> {
    await this.repository.delete(id);
  }
}
