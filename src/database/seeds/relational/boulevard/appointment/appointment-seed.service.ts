import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { AppointmentEntity } from '../../../../../appointments/infrastructure/persistence/relational/entities/appointment.entity';

@Injectable()
export class AppointmentSeedService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private repository: Repository<AppointmentEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();
    if (count > 0) return;

    const filePath = path.join(__dirname, '../data', 'appointments.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.length === 0) return;

    const entities = data.map((item: any) => this.repository.create(item));
    await this.repository.save(entities);
  }
}
