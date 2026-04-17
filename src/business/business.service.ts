import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessRepository } from './infrastructure/persistence/business.repository';
import { Business } from './domain/business';
import { NullableType } from '../utils/types/nullable.type';

@Injectable()
export class BusinessService {
  constructor(private readonly businessRepository: BusinessRepository) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    return this.businessRepository.create({
      id: createBusinessDto.id,
      name: createBusinessDto.name,
      address: createBusinessDto.address ?? {},
      allowLoginWithMultipleClients: createBusinessDto.allowLoginWithMultipleClients ?? null,
      billingContactEmail: createBusinessDto.billingContactEmail ?? null,
      custom: createBusinessDto.custom ?? {},
      customFields: createBusinessDto.customFields ?? [],
      customBookingUrl: createBusinessDto.customBookingUrl ?? null,
      phone: createBusinessDto.phone ?? null,
      showLocationHours: createBusinessDto.showLocationHours ?? false,
      tz: createBusinessDto.tz ?? '',
      website: createBusinessDto.website ?? null,
    });
  }

  findById(id: Business['id']): Promise<NullableType<Business>> {
    return this.businessRepository.findById(id);
  }

  findAll(): Promise<Business[]> {
    return this.businessRepository.findAll();
  }

  async update(id: Business['id'], updateBusinessDto: UpdateBusinessDto): Promise<Business | null> {
    return this.businessRepository.update(id, updateBusinessDto as Partial<Business>);
  }

  async remove(id: Business['id']): Promise<void> {
    await this.businessRepository.remove(id);
  }
}
