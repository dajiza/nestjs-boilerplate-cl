import { Shift } from '../../../../domain/shift';
import { ShiftEntity } from '../entities/shift.entity';

export class ShiftMapper {
  static toDomain(raw: ShiftEntity): Shift {
    const domainEntity = new Shift();
    domainEntity.id = raw.id;
    domainEntity.available = raw.available;
    domainEntity.date = raw.date;
    domainEntity.endTime = raw.endTime;
    domainEntity.location = raw.location;
    domainEntity.locationId = raw.locationId;
    domainEntity.recurrence = raw.recurrence;
    domainEntity.staff = raw.staff;
    domainEntity.staffId = raw.staffId;
    domainEntity.startTime = raw.startTime;
    domainEntity.unavailableReason = raw.unavailableReason;
    return domainEntity;
  }

  static toPersistence(domainEntity: Shift): ShiftEntity {
    const persistenceEntity = new ShiftEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.available = domainEntity.available;
    persistenceEntity.date = domainEntity.date;
    persistenceEntity.endTime = domainEntity.endTime;
    persistenceEntity.location = domainEntity.location;
    persistenceEntity.locationId = domainEntity.locationId ?? null;
    persistenceEntity.recurrence = domainEntity.recurrence ?? null;
    persistenceEntity.staff = domainEntity.staff;
    persistenceEntity.staffId = domainEntity.staffId ?? null;
    persistenceEntity.startTime = domainEntity.startTime;
    persistenceEntity.unavailableReason = domainEntity.unavailableReason ?? null;
    return persistenceEntity;
  }
}
