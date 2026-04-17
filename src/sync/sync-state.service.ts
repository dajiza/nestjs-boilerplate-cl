import { Injectable } from '@nestjs/common';
import { SyncStateRepository } from './infrastructure/persistence/sync-state.repository';

@Injectable()
export class SyncStateService {
  constructor(private readonly syncStateRepository: SyncStateRepository) {}

  async createSyncState(data: {
    localId: string;
    boulevardId: string;
    entityType: string;
    syncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
    error?: any;
  }): Promise<void> {
    await this.syncStateRepository.createSyncState({
      localId: data.localId,
      boulevardId: data.boulevardId,
      entityType: data.entityType,
      syncStatus: data.syncStatus,
      error: data.error ? JSON.parse(JSON.stringify(data.error)) : null,
      syncedAt: new Date(),
    });
  }

  async updateSyncState(data: {
    localId: string;
    boulevardId: string;
    entityType: string;
    syncStatus: 'SYNCED' | 'PENDING' | 'FAILED';
    error?: any;
  }): Promise<void> {
    const existing = await this.syncStateRepository.findByLocalId(data.localId);
    if (!existing) {
      await this.createSyncState(data);
    } else {
      await this.syncStateRepository.updateSyncState(existing.id, {
        boulevardId: data.boulevardId,
        entityType: data.entityType,
        syncStatus: data.syncStatus,
        error: data.error ? JSON.parse(JSON.stringify(data.error)) : null,
      });
    }
  }
}
