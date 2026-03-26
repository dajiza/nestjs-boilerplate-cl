import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from '../entities/room.entity';
import { Room } from '../../../../domain/room';
import { RoomRepository } from '../../room.repository';
import { RoomMapper } from '../mappers/room.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';
import { NullableType } from '../../../../../utils/types/nullable.type';

@Injectable()
export class RoomsRelationalRepository implements RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomsRepository: Repository<RoomEntity>,
  ) {}

  async create(data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> {
    const persistenceModel = RoomMapper.toPersistence(data as Room);
    const newEntity = await this.roomsRepository.save(this.roomsRepository.create(persistenceModel));
    return RoomMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Room[]; total: number }> {
    const [entities, total] = await this.roomsRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map((room) => RoomMapper.toDomain(room)),
      total,
    };
  }

  async findById(id: string): Promise<NullableType<Room>> {
    const entity = await this.roomsRepository.findOne({
      where: { id },
    });

    return entity ? RoomMapper.toDomain(entity) : null;
  }

  async findByServiceId(serviceId: string): Promise<Room[]> {
    const entities = await this.roomsRepository.find({
      where: { serviceId },
      order: { name: 'ASC' },
    });

    return entities.map((room) => RoomMapper.toDomain(room));
  }

  async update(id: string, payload: Partial<Room>): Promise<Room> {
    const entity = await this.roomsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Room not found');
    }

    const updatedEntity = await this.roomsRepository.save(
      this.roomsRepository.create({
        ...entity,
        ...RoomMapper.toPersistence(payload),
      }),
    );

    return RoomMapper.toDomain(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.roomsRepository.delete(id);
  }
}
