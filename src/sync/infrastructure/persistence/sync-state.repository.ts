import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncStateEntity } from './entities/sync-state.entity';

@Injectable()
export class SyncStateRepository {
  constructor(
    @InjectRepository(SyncStateEntity)
    private readonly repository: Repository<SyncStateEntity>,
  ) {}

  async createSyncState(data: Partial<SyncStateEntity>): Promise<SyncStateEntity> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async findByLocalId(localId: string): Promise<SyncStateEntity | null> {
    return this.repository.findOne({ where: { localId } });
  }

  async findByBoulevardId(boulevardId: string): Promise<SyncStateEntity | null> {
    return this.repository.findOne({ where: { boulevardId } });
  }

  async updateSyncState(id: string, data: Partial<SyncStateEntity>): Promise<SyncStateEntity | null> {
    await this.repository.update(id, data);
    return this.repository.findOne({ where: { id } });
  }
}
