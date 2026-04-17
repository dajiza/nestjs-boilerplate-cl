import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../entities/appointment.entity';
import { ClientEntity } from '../../../../../clients/infrastructure/persistence/relational/entities/client.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Appointment } from '../../../../domain/appointment';
import { AppointmentRepository, AppointmentFilterOptions } from '../../appointment.repository';
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

  async findByStaffIdAndDateRange({ staffId, startDate, endDate }: { staffId: string; startDate: Date; endDate: Date }): Promise<Appointment[]> {
    if (!staffId) return [];

    // Query staffId from appointmentServices JSONB array
    // appointment table has no staffId column; staffId lives in appointmentServices JSONB
    const entities = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect(ClientEntity, 'client', 'client.id = appointment.clientId')
      .where(`EXISTS (SELECT 1 FROM jsonb_array_elements(appointment."appointmentServices") elem WHERE elem->>'staffId' = :staffId)`)
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

  async findByStaffIdsAndDateRange({ staffIds, startDate, endDate }: { staffIds: string[]; startDate: Date; endDate: Date }): Promise<Appointment[]> {
    if (!staffIds.length) return [];

    // Build parameterized query for multiple staffIds in JSONB
    const staffConditions = staffIds.map((_, i) => `elem->>'staffId' = :staffId${i}`).join(' OR ');
    const params: Record<string, any> = { startDate, endDate, cancelled: false };
    staffIds.forEach((id, i) => {
      params[`staffId${i}`] = id;
    });

    const entities = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect(ClientEntity, 'client', 'client.id = appointment.clientId')
      .where(`EXISTS (SELECT 1 FROM jsonb_array_elements(appointment."appointmentServices") elem WHERE ${staffConditions})`, params)
      .andWhere('appointment.startAt >= :startDate')
      .andWhere('appointment.startAt < :endDate')
      .andWhere('appointment.cancelled = :cancelled')
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

  async findByLocationIdAndDateRange({
    locationId,
    startDate,
    endDate,
  }: {
    locationId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Appointment[]> {
    if (!locationId) return [];

    const entities = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect(ClientEntity, 'client', 'client.id = appointment.clientId')
      .where('appointment.locationId = :locationId', { locationId })
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

  async findWithFilters(filters: AppointmentFilterOptions): Promise<{ data: Appointment[]; total: number }> {
    const qb = this.appointmentsRepository.createQueryBuilder('appointment').leftJoin(ClientEntity, 'client', 'client.id = appointment.clientId');

    if (filters.locationId) {
      qb.andWhere('appointment.locationId = :locationId', { locationId: filters.locationId });
    }
    if (filters.clientId) {
      qb.andWhere('appointment.clientId = :clientId', { clientId: filters.clientId });
    }
    if (filters.staffId) {
      qb.andWhere(`EXISTS (SELECT 1 FROM jsonb_array_elements(appointment."appointmentServices") elem WHERE elem->>'staffId' = :staffId)`, {
        staffId: filters.staffId,
      });
    }
    if (filters.startDate) {
      qb.andWhere('appointment.startAt >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      qb.andWhere('appointment.startAt < :endDate', { endDate: filters.endDate });
    }
    if (filters.cancelled !== undefined) {
      qb.andWhere('appointment.cancelled = :cancelled', { cancelled: filters.cancelled });
    }
    if (filters.state) {
      qb.andWhere('appointment.state = :state', { state: filters.state });
    }

    // Count total before pagination
    const totalQb = qb.clone();
    const countResult = await totalQb.select('COUNT(appointment.id)', 'count').getRawOne();
    const total = parseInt(countResult?.count ?? '0', 10);

    // Apply pagination
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 10, 50);
    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('appointment.startAt', 'DESC');

    qb.select([
      'appointment.*',
      "json_build_object('id', client.id, 'name', client.name, 'firstName', client.\"firstName\", 'lastName', client.\"lastName\", 'email', client.email, 'mobilePhone', client.\"mobilePhone\") as client",
    ]);

    const rawResults = await qb.getRawMany();

    const data = rawResults.map((raw) => {
      const appointment = AppointmentMapper.toDomain({
        ...raw,
        startAt: raw.startAt,
        createdAt: raw.createdAt,
        endAt: raw.endAt,
      } as AppointmentEntity);
      appointment.client = raw.client;
      return appointment;
    });

    return { data, total };
  }

  async update(id: Appointment['id'], payload: Partial<Appointment>): Promise<Appointment> {
    const entity = await this.appointmentsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new NotFoundException('Appointment not found');
    }

    const updatedEntity = await this.appointmentsRepository.save(
      this.appointmentsRepository.create(
        AppointmentMapper.toPersistence({
          ...AppointmentMapper.toDomain(entity),
          ...payload,
        } as Appointment),
      ),
    );

    return AppointmentMapper.toDomain(updatedEntity);
  }

  async remove(id: string): Promise<void> {
    await this.appointmentsRepository.delete(id);
  }
}
