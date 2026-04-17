import { Injectable } from '@nestjs/common';
import { CreateStaffRoleDto } from './dto/create-staff-role.dto';
import { UpdateStaffRoleDto } from './dto/update-staff-role.dto';
import { StaffRoleRepository } from './infrastructure/persistence/staff-role.repository';
import { StaffRole } from './domain/staff-role';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class StaffRoleService {
  constructor(private readonly repository: StaffRoleRepository) {}

  async create(dto: CreateStaffRoleDto): Promise<StaffRole> {
    return this.repository.create({
      id: dto.id,
      name: dto.name,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: StaffRole[]; total: number }> {
    return this.repository.findManyWithPagination({ paginationOptions });
  }

  findById(id: StaffRole['id']): Promise<NullableType<StaffRole>> {
    return this.repository.findById(id);
  }

  async update(id: StaffRole['id'], dto: UpdateStaffRoleDto): Promise<StaffRole | null> {
    return this.repository.update(id, {
      ...dto,
    });
  }

  async remove(id: StaffRole['id']): Promise<void> {
    await this.repository.remove(id);
  }
}
