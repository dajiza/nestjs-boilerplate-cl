import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomRepository } from './infrastructure/persistence/room.repository';
import { Room } from './domain/room';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class RoomsService {
  constructor(private readonly roomsRepository: RoomRepository) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsRepository.create({
      name: createRoomDto.name,
      serviceId: createRoomDto.serviceId ?? null,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Room[]; total: number }> {
    return this.roomsRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findById(id: string): Promise<Room | null> {
    return this.roomsRepository.findById(id);
  }

  findByServiceId(serviceId: string): Promise<Room[]> {
    return this.roomsRepository.findByServiceId(serviceId);
  }

  async update(id: string, updateRoomDto: UpdateRoomDto): Promise<Room | null> {
    return this.roomsRepository.update(id, updateRoomDto);
  }

  async remove(id: string): Promise<void> {
    await this.roomsRepository.remove(id);
  }
}
