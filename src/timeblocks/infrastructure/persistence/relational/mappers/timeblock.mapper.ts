import { Timeblock, TimeblockReason } from '../../../../domain/timeblock';
import { TimeblockEntity } from '../entities/timeblock.entity';

export class TimeblockMapper {
  static toDomain(raw: TimeblockEntity): Timeblock {
    const domainEntity = new Timeblock();
    domainEntity.id = raw.id;
    domainEntity.cancelled = raw.cancelled;
    domainEntity.duration = raw.duration;
    domainEntity.endAt = raw.endAt;
    domainEntity.location = raw.location;
    domainEntity.reason = (raw.reason as TimeblockReason) ?? null;
    domainEntity.staff = raw.staff;
    domainEntity.staffId = raw.staffId;
    domainEntity.startAt = raw.startAt;
    domainEntity.title = raw.title;
    return domainEntity;
  }

  static toPersistence(domainEntity: Timeblock): TimeblockEntity {
    const persistenceEntity = new TimeblockEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.cancelled = domainEntity.cancelled ?? null;
    persistenceEntity.duration = domainEntity.duration;
    persistenceEntity.endAt = domainEntity.endAt;
    persistenceEntity.location = domainEntity.location;
    persistenceEntity.reason = domainEntity.reason ?? null;
    persistenceEntity.staff = domainEntity.staff;
    persistenceEntity.staffId = domainEntity.staffId;
    persistenceEntity.startAt = domainEntity.startAt;
    persistenceEntity.title = domainEntity.title ?? null;
    return persistenceEntity;
  }
}
