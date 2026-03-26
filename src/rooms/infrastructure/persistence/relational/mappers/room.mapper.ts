import { RoomEntity } from '../entities/room.entity';
import { Room } from '../../../../domain/room';

export class RoomMapper {
  static toDomain(raw: RoomEntity): Room {
    const room = new Room();
    room.id = raw.id;
    room.name = raw.name;
    room.serviceId = raw.serviceId;
    room.createdAt = raw.createdAt;
    room.updatedAt = raw.updatedAt;
    return room;
  }

  static toPersistence(room: Partial<Room>): Partial<RoomEntity> {
    const entity = new RoomEntity();
    if (room.id) entity.id = room.id;
    if (room.name) entity.name = room.name;
    if (room.serviceId !== undefined) entity.serviceId = room.serviceId;
    if (room.createdAt) entity.createdAt = room.createdAt;
    if (room.updatedAt) entity.updatedAt = room.updatedAt;
    return entity;
  }
}
