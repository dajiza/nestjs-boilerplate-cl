import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientEntity } from '../entities/client.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Client } from '../../../../domain/client';
import { ClientRepository } from '../../client.repository';
import { ClientMapper } from '../mappers/client.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ClientsRelationalRepository implements ClientRepository {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientsRepository: Repository<ClientEntity>,
  ) {}

  async create(data: Client): Promise<Client> {
    const persistenceModel = ClientMapper.toPersistence(data);
    const newEntity = await this.clientsRepository.save(this.clientsRepository.create(persistenceModel));
    return ClientMapper.toDomain(newEntity);
  }

  async findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Client[]; total: number }> {
    const [entities, total] = await this.clientsRepository.findAndCount({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: entities.map((client) => ClientMapper.toDomain(client)),
      total,
    };
  }

  async findById(id: Client['id']): Promise<NullableType<Client>> {
    const entity = await this.clientsRepository.findOne({
      where: { id },
    });

    return entity ? ClientMapper.toDomain(entity) : null;
  }

  async findByEmail(email: Client['email']): Promise<NullableType<Client>> {
    if (!email) return null;

    const entity = await this.clientsRepository.findOne({
      where: { email },
    });

    return entity ? ClientMapper.toDomain(entity) : null;
  }

  async update(id: Client['id'], payload: Partial<Client>): Promise<Client> {
    const entity = await this.clientsRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Client not found');
    }

    const updatedEntity = await this.clientsRepository.save(
      this.clientsRepository.create(
        ClientMapper.toPersistence({
          ...ClientMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ClientMapper.toDomain(updatedEntity);
  }

  async remove(id: Client['id']): Promise<void> {
    await this.clientsRepository.delete(id);
  }
}
