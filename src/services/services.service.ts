import { Injectable } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceRepository } from './infrastructure/persistence/service.repository';
import { Service } from './domain/service';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class ServicesService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceRepository.create({
      id: createServiceDto.id,
      name: createServiceDto.name,
      active: createServiceDto.active,
      addon: createServiceDto.addon,
      createdAt: new Date(createServiceDto.createdAt),
      updatedAt: new Date(createServiceDto.updatedAt),
      defaultDuration: createServiceDto.defaultDuration,
      defaultPrice: createServiceDto.defaultPrice,
      locationId: createServiceDto.locationId ?? null,
      categoryId: createServiceDto.categoryId ?? null,
      custom: createServiceDto.custom ?? null,
      customFields: createServiceDto.customFields ?? null,
      keys: createServiceDto.keys ?? null,
      addons: createServiceDto.addons ?? null,
      category: createServiceDto.category ?? null,
      description: createServiceDto.description ?? null,
      externalId: createServiceDto.externalId ?? null,
      serviceOptionGroups: createServiceDto.serviceOptionGroups ?? null,
      serviceOverrides: createServiceDto.serviceOverrides ?? null,
      serviceStatus: createServiceDto.serviceStatus ?? null,
      sortPath: createServiceDto.sortPath ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Service[]; total: number }> {
    return this.serviceRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findById(id: Service['id']): Promise<NullableType<Service>> {
    return this.serviceRepository.findById(id);
  }

  async update(id: Service['id'], updateServiceDto: UpdateServiceDto): Promise<Service | null> {
    return this.serviceRepository.update(id, updateServiceDto);
  }

  async remove(id: Service['id']): Promise<void> {
    await this.serviceRepository.remove(id);
  }
}
