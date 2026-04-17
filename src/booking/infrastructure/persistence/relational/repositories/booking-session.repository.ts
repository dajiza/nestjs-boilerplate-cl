import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { BookingSessionEntity } from '../entities/booking-session.entity';
import { BookingSession } from '../../../../domain/booking-session';
import { BookingSessionRepository } from '../../booking-session.repository';
import { BookingSessionMapper } from '../mappers/booking-session.mapper';
import { BookingSessionState } from '../../../../domain/booking-session-state';

@Injectable()
export class BookingSessionRelationalRepository implements BookingSessionRepository {
  constructor(
    @InjectRepository(BookingSessionEntity)
    private readonly repository: Repository<BookingSessionEntity>,
  ) {}

  async create(data: BookingSession): Promise<BookingSession> {
    const persistenceModel = BookingSessionMapper.toPersistence(data);
    const entity = this.repository.create(persistenceModel);
    const saved = await this.repository.save(entity);
    return BookingSessionMapper.toDomain(saved);
  }

  async findById(id: string): Promise<BookingSession | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? BookingSessionMapper.toDomain(entity) : null;
  }

  async update(id: string, payload: Partial<BookingSession>): Promise<BookingSession | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;

    const domain = BookingSessionMapper.toDomain(entity);
    const merged = { ...domain, ...payload, updatedAt: new Date() };
    const persistenceModel = BookingSessionMapper.toPersistence(merged as BookingSession);

    await this.repository.save(
      this.repository.create({
        ...entity,
        ...persistenceModel,
      }),
    );

    const updated = await this.repository.findOne({ where: { id } });
    return updated ? BookingSessionMapper.toDomain(updated) : null;
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async cleanExpired(): Promise<number> {
    const result = await this.repository
      .createQueryBuilder()
      .delete()
      .from(BookingSessionEntity)
      .where('expiresAt < :now', { now: new Date() })
      .andWhere('state != :completed', { completed: BookingSessionState.COMPLETED })
      .execute();

    return result.affected || 0;
  }
}
