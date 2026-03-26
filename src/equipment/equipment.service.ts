import { Injectable } from '@nestjs/common';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { EquipmentRepository } from './infrastructure/persistence/equipment.repository';
import { Equipment } from './domain/equipment';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class EquipmentService {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    return this.equipmentRepository.create({
      name: createEquipmentDto.name,
      serviceId: createEquipmentDto.serviceId ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Equipment[]; total: number }> {
    return this.equipmentRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findById(id: string): Promise<Equipment | null> {
    return this.equipmentRepository.findById(id);
  }

  findByServiceId(serviceId: string): Promise<Equipment[]> {
    return this.equipmentRepository.findByServiceId(serviceId);
  }

  async update(id: string, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment | null> {
    return this.equipmentRepository.update(id, updateEquipmentDto);
  }

  async remove(id: string): Promise<void> {
    await this.equipmentRepository.remove(id);
  }
}
