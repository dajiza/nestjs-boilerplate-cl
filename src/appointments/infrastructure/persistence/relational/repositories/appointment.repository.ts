import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../entities/appointment.entity';
import { ClientEntity } from '../../../../../clients/infrastructure/persistence/relational/entities/client.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Appointment } from '../../../../domain/appointment';
import { AppointmentRepository } from '../../appointment.repository';
import { AppointmentMapper } from '../mappers/appointment.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AppointmentsRelationalRepository implements AppointmentRepository {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentsRepository: Repository<AppointmentEntity>,
  ) {}

  async create(data: Appointment): Promise<Appointment> {
    const persistenceModel = AppointmentMapper.toPersistence(data);
    const newEntity = await this.appointmentsRepository.save(this.appointmentsRepository.create(persistenceModel));
    return AppointmentMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Appointment[]; total: number }> {
    const [entities, total] = await this.appointmentsRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map((appointment) => AppointmentMapper.toDomain(appointment)),
      total,
    };
  }

  async findById(id: Appointment['id']): Promise<NullableType<Appointment>> {
    const entity = await this.appointmentsRepository.findOne({
      where: { id },
    });

    return entity ? AppointmentMapper.toDomain(entity) : null;
  }

  async findByClientId(clientId: Appointment['clientId']): Promise<Appointment[]> {
    if (!clientId) return [];

    const entities = await this.appointmentsRepository.find({
      where: { clientId },
      order: { startAt: 'DESC' },
    });

    return entities.map((appointment) => AppointmentMapper.toDomain(appointment));
  }

  async findByStaffIdAndDateRange({
    staffId,
    startDate,
    endDate,
  }: {
    staffId: Appointment['staffId'];
    startDate: Date;
    endDate: Date;
  }): Promise<Appointment[]> {
    if (!staffId) return [];

    const entities = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect(ClientEntity, 'client', 'client.id = appointment.clientId')
      .where('appointment.staffId = :staffId', { staffId })
      .andWhere('appointment.startAt >= :startDate', { startDate })
      .andWhere('appointment.startAt < :endDate', { endDate })
      .andWhere('appointment.cancelled = :cancelled', { cancelled: false })
      .orderBy('appointment.startAt', 'ASC')
      .select([
        'appointment.*',
        "json_build_object('id', client.id, 'name', client.name, 'firstName', client.\"firstName\", 'lastName', client.\"lastName\", 'email', client.email, 'mobilePhone', client.\"mobilePhone\") as client",
      ])
      .getRawMany();

    return entities.map((raw) => {
      const appointment = AppointmentMapper.toDomain({
        ...raw,
        startAt: raw.startAt,
        createdAt: raw.createdAt,
        endAt: raw.endAt,
      } as AppointmentEntity);
      appointment.client = raw.client;
      return appointment;
    });
  }

  async findByRoomIdAndDateRange({ roomId, startDate, endDate }: { roomId: string; startDate: Date; endDate: Date }): Promise<Appointment[]> {
    if (!roomId) return [];

    const entities = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect(ClientEntity, 'client', 'client.id = appointment.clientId')
      .where('appointment.roomId = :roomId', { roomId })
      .andWhere('appointment.startAt >= :startDate', { startDate })
      .andWhere('appointment.startAt < :endDate', { endDate })
      .andWhere('appointment.cancelled = :cancelled', { cancelled: false })
      .orderBy('appointment.startAt', 'ASC')
      .select([
        'appointment.*',
        "json_build_object('id', client.id, 'name', client.name, 'firstName', client.\"firstName\", 'lastName', client.\"lastName\", 'email', client.email, 'mobilePhone', client.\"mobilePhone\") as client",
      ])
      .getRawMany();

    return entities.map((raw) => {
      const appointment = AppointmentMapper.toDomain({
        ...raw,
        startAt: raw.startAt,
        createdAt: raw.createdAt,
        endAt: raw.endAt,
      } as AppointmentEntity);
      appointment.client = raw.client;
      return appointment;
    });
  }

  async findByEquipmentIdAndDateRange({
    equipmentId,
    startDate,
    endDate,
  }: {
    equipmentId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Appointment[]> {
    if (!equipmentId) return [];

    const entities = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect(ClientEntity, 'client', 'client.id = appointment.clientId')
      .where('appointment.equipmentId = :equipmentId', { equipmentId })
      .andWhere('appointment.startAt >= :startDate', { startDate })
      .andWhere('appointment.startAt < :endDate', { endDate })
      .andWhere('appointment.cancelled = :cancelled', { cancelled: false })
      .orderBy('appointment.startAt', 'ASC')
      .select([
        'appointment.*',
        "json_build_object('id', client.id, 'name', client.name, 'firstName', client.\"firstName\", 'lastName', client.\"lastName\", 'email', client.email, 'mobilePhone', client.\"mobilePhone\") as client",
      ])
      .getRawMany();

    return entities.map((raw) => {
      const appointment = AppointmentMapper.toDomain({
        ...raw,
        startAt: raw.startAt,
        createdAt: raw.createdAt,
        endAt: raw.endAt,
      } as AppointmentEntity);
      appointment.client = raw.client;
      return appointment;
    });
  }

  async findByDateRange({ startDate, endDate }: { startDate: Date; endDate: Date }): Promise<Appointment[]> {
    const entities = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect(ClientEntity, 'client', 'client.id = appointment.clientId')
      .where('appointment.startAt >= :startDate', { startDate })
      .andWhere('appointment.startAt < :endDate', { endDate })
      .andWhere('appointment.cancelled = :cancelled', { cancelled: false })
      .orderBy('appointment.startAt', 'ASC')
      .select([
        'appointment.*',
        "json_build_object('id', client.id, 'name', client.name, 'firstName', client.\"firstName\", 'lastName', client.\"lastName\", 'email', client.email, 'mobilePhone', client.\"mobilePhone\") as client",
      ])
      .getRawMany();

    return entities.map((raw) => {
      const appointment = AppointmentMapper.toDomain({
        ...raw,
        startAt: raw.startAt,
        createdAt: raw.createdAt,
        endAt: raw.endAt,
      } as AppointmentEntity);
      appointment.client = raw.client;
      return appointment;
    });
  }

  async update(id: Appointment['id'], payload: Partial<Appointment>): Promise<Appointment> {
    const entity = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Appointment not found');
    }

    const updatedEntity = await this.appointmentsRepository.save(
      this.appointmentsRepository.create(
        AppointmentMapper.toPersistence({
          ...AppointmentMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AppointmentMapper.toDomain(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.appointmentsRepository.delete(id);
  }
}
