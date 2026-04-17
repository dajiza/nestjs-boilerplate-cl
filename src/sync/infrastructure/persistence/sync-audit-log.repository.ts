import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SyncAuditLogEntity } from './entities/sync-audit-log.entity';

@Injectable()
export class SyncAuditLogRepository {
  constructor(
    @InjectRepository(SyncAuditLogEntity)
    private readonly repository: Repository<SyncAuditLogEntity>,
  ) {}

  async createLog(data: Partial<SyncAuditLogEntity>): Promise<SyncAuditLogEntity> {
    return this.repository.save(data);
  }

  async findByEntityId(entityId: string): Promise<SyncAuditLogEntity[]> {
    return this.repository.find({ where: { entityId } });
  }

  async findFailedSyncs(limit: number = 100): Promise<SyncAuditLogEntity[]> {
    return this.repository.find({
      where: { status: 'FAILED' },
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }
}
