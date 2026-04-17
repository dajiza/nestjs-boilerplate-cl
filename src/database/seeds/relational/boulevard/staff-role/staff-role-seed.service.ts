import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { StaffRoleEntity } from '../../../../../staff-roles/infrastructure/persistence/relational/entities/staff-role.entity';

@Injectable()
export class StaffRoleSeedService {
  constructor(
    @InjectRepository(StaffRoleEntity)
    private repository: Repository<StaffRoleEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();
    if (count > 0) return;

    const filePath = path.join(__dirname, '../data', 'staff-roles.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.length === 0) return;

    const entities = data.map((item: any) => this.repository.create(item));
    await this.repository.save(entities);
  }
}
