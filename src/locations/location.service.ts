import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { LocationRepository } from './infrastructure/persistence/location.repository';
import { Location } from './domain/location';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class LocationService {
  constructor(private readonly repository: LocationRepository) {}

  async create(dto: CreateLocationDto): Promise<Location> {
    return this.repository.create({
      id: dto.id,
      name: dto.name,
      address: dto.address ?? {},
      arrivalInstructions: dto.arrivalInstructions ?? null,
      billingContactEmail: dto.billingContactEmail ?? null,
      businessName: dto.businessName ?? '',
      contactEmail: dto.contactEmail ?? null,
      coordinates: dto.coordinates ?? null,
      externalId: dto.externalId ?? null,
      googlePlaceId: dto.googlePlaceId ?? null,
      hours: dto.hours ?? null,
      isRemote: dto.isRemote ?? false,
      paymentOptions: dto.paymentOptions ?? [],
      phone: dto.phone ?? null,
      showLocationHours: dto.showLocationHours ?? false,
      tz: dto.tz ?? '',
      website: dto.website ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Location[]; total: number }> {
    return this.repository.findManyWithPagination({ paginationOptions });
  }

  findById(id: Location['id']): Promise<NullableType<Location>> {
    return this.repository.findById(id);
  }

  async update(id: Location['id'], dto: UpdateLocationDto): Promise<Location | null> {
    return this.repository.update(id, dto as Partial<Location>);
  }

  async remove(id: Location['id']): Promise<void> {
    await this.repository.remove(id);
  }
}
