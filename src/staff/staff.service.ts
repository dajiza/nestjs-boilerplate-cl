import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { StaffRepository } from './infrastructure/persistence/staff.repository';
import { Staff } from './domain/staff';
import { NullableType } from '../utils/types/nullable.type';
import type { AppRoleSummary, StaffLocationAbilities, StaffRoleSummary } from '../utils/types/boulevard.types';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class StaffService {
  constructor(private readonly staffRepository: StaffRepository) {}

  async create(createStaffDto: CreateStaffDto): Promise<Staff> {
    return this.staffRepository.create({
      id: createStaffDto.id,
      email: createStaffDto.email,
      name: createStaffDto.name,
      mobilePhone: createStaffDto.mobilePhone,
      active: createStaffDto.active ?? null,
      displayName: createStaffDto.displayName ?? '',
      firstName: createStaffDto.firstName ?? '',
      lastName: createStaffDto.lastName ?? null,
      createdAt: createStaffDto.createdAt ? new Date(createStaffDto.createdAt) : new Date(),
      updatedAt: createStaffDto.updatedAt ? new Date(createStaffDto.updatedAt) : new Date(),
      alternateId: createStaffDto.alternateId ?? null,
      appRole: createStaffDto.appRole ?? ({} as AppRoleSummary),
      appRoleId: createStaffDto.appRoleId ?? null,
      avatar: createStaffDto.avatar ?? null,
      bio: createStaffDto.bio ?? null,
      enabledForFutureLocations: createStaffDto.enabledForFutureLocations ?? false,
      externalId: createStaffDto.externalId ?? null,
      externalNickname: createStaffDto.externalNickname ?? null,
      externallyBookable: createStaffDto.externallyBookable ?? null,
      locationAbilities: createStaffDto.locationAbilities ?? ({} as StaffLocationAbilities),
      locations: createStaffDto.locations ?? null,
      nickname: createStaffDto.nickname ?? null,
      role: createStaffDto.role ?? ({} as StaffRoleSummary),
      staffRoleId: createStaffDto.staffRoleId ?? '',
      suspended: createStaffDto.suspended ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Staff[]; total: number }> {
    return this.staffRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findById(id: Staff['id']): Promise<NullableType<Staff>> {
    return this.staffRepository.findById(id);
  }

  findByEmail(email: Staff['email']): Promise<NullableType<Staff>> {
    return this.staffRepository.findByEmail(email);
  }

  async update(id: Staff['id'], updateStaffDto: UpdateStaffDto): Promise<Staff | null> {
    return this.staffRepository.update(id, updateStaffDto as Partial<Staff>);
  }

  async remove(id: Staff['id']): Promise<void> {
    await this.staffRepository.remove(id);
  }
}
