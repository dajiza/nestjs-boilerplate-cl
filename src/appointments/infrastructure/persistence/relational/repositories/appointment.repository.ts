import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentEntity } from '../entities/appointment.entity';
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
      .where('appointment.staffId = :staffId', { staffId })
      .andWhere('appointment.startAt >= :startDate', { startDate })
      .andWhere('appointment.startAt < :endDate', { endDate })
      .andWhere('appointment.cancelled = :cancelled', { cancelled: false })
      .orderBy('appointment.startAt', 'ASC')
      .getMany();

    return entities.map((appointment) => AppointmentMapper.toDomain(appointment));
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

  async remove(id: Appointment['id']): Promise<void> {
    await this.appointmentsRepository.delete(id);
  }
}
