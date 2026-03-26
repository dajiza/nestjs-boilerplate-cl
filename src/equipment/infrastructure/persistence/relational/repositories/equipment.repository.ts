import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentEntity } from '../entities/equipment.entity';
import { Equipment } from '../../../../domain/equipment';
import { EquipmentRepository } from '../../equipment.repository';
import { EquipmentMapper } from '../mappers/equipment.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class EquipmentRelationalRepository implements EquipmentRepository {
  constructor(
    @InjectRepository(EquipmentEntity)
    private readonly equipmentRepository: Repository<EquipmentEntity>,
  ) {}

  async create(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Equipment> {
    const persistenceModel = EquipmentMapper.toPersistence(data as Equipment);
    const newEntity = await this.equipmentRepository.save(this.equipmentRepository.create(persistenceModel));
    return EquipmentMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Equipment[]; total: number }> {
    const [entities, total] = await this.equipmentRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map((equipment) => EquipmentMapper.toDomain(equipment)),
      total,
    };
  }

  async findById(id: string): Promise<NullableType<Equipment>> {
    const entity = await this.equipmentRepository.findOne({
      where: { id },
    });

    return entity ? EquipmentMapper.toDomain(entity) : null;
  }

  async findByServiceId(serviceId: string): Promise<Equipment[]> {
    const entities = await this.equipmentRepository.find({
      where: { serviceId },
      order: { name: 'ASC' },
    });

    return entities.map((equipment) => EquipmentMapper.toDomain(equipment));
  }

  async update(id: string, payload: Partial<Equipment>): Promise<Equipment> {
    const entity = await this.equipmentRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Equipment not found');
    }

    if (payload.name !== undefined) {
      entity.name = payload.name;
    }
    if (payload.serviceId !== undefined) {
      entity.serviceId = payload.serviceId;
    }

    const updatedEntity = await this.equipmentRepository.save(entity);

    return EquipmentMapper.toDomain(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.equipmentRepository.delete(id);
  }
}
