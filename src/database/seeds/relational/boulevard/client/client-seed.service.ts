import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';
import { ClientEntity } from '../../../../../clients/infrastructure/persistence/relational/entities/client.entity';

@Injectable()
export class ClientSeedService {
  constructor(
    @InjectRepository(ClientEntity)
    private repository: Repository<ClientEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();
    if (count > 0) return;

    const filePath = path.join(__dirname, '../data', 'clients.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.length === 0) return;

    const entities = data.map((item: any) => this.repository.create(item));
    await this.repository.save(entities);
  }
}
