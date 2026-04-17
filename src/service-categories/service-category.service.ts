import { Injectable } from '@nestjs/common';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { ServiceCategoryRepository } from './infrastructure/persistence/service-category.repository';
import { ServiceCategory } from './domain/service-category';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class ServiceCategoryService {
  constructor(private readonly repository: ServiceCategoryRepository) {}

  async create(dto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    return this.repository.create({
      id: dto.id,
      name: dto.name,
      active: dto.active,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date(),
      services: dto.services ?? null,
      sortPath: dto.sortPath ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: ServiceCategory[]; total: number }> {
    return this.repository.findManyWithPagination({ paginationOptions });
  }

  findById(id: ServiceCategory['id']): Promise<NullableType<ServiceCategory>> {
    return this.repository.findById(id);
  }

  async update(id: ServiceCategory['id'], dto: UpdateServiceCategoryDto): Promise<ServiceCategory | null> {
    return this.repository.update(id, {
      ...dto,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

  async remove(id: ServiceCategory['id']): Promise<void> {
    await this.repository.remove(id);
  }
}
