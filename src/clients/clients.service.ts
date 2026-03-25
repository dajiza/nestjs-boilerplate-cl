import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ClientRepository } from './infrastructure/persistence/client.repository';
import { Client } from './domain/client';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsRepository: ClientRepository) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsRepository.create({
      id: createClientDto.id,
      active: createClientDto.active,
      appointmentCount: createClientDto.appointmentCount,
      createdAt: createClientDto.createdAt,
      creditCardsOnFile: createClientDto.creditCardsOnFile ?? null,
      currentAccountBalance: createClientDto.currentAccountBalance,
      currentAccountUpdatedAt: createClientDto.currentAccountUpdatedAt ?? null,
      custom: createClientDto.custom ?? null,
      customFields: createClientDto.customFields ?? null,
      keys: createClientDto.keys ?? null,
      dob: createClientDto.dob ?? null,
      email: createClientDto.email ?? null,
      externalId: createClientDto.externalId ?? null,
      firstName: createClientDto.firstName ?? null,
      hasCardOnFile: createClientDto.hasCardOnFile,
      lastName: createClientDto.lastName ?? null,
      marketingSettings: createClientDto.marketingSettings ?? null,
      mergedIntoClientId: createClientDto.mergedIntoClientId ?? null,
      mobilePhone: createClientDto.mobilePhone ?? null,
      name: createClientDto.name ?? null,
      notes: createClientDto.notes ?? null,
      primaryLocation: createClientDto.primaryLocation ?? null,
      pronoun: createClientDto.pronoun ?? null,
      reminderSettings: createClientDto.reminderSettings ?? null,
      schedulingAlert: createClientDto.schedulingAlert ?? null,
      tags: createClientDto.tags ?? null,
      updatedAt: createClientDto.updatedAt,
    });
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Client[]; total: number }> {
    return this.clientsRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findById(id: Client['id']): Promise<NullableType<Client>> {
    return this.clientsRepository.findById(id);
  }

  findByEmail(email: Client['email']): Promise<NullableType<Client>> {
    return this.clientsRepository.findByEmail(email);
  }

  async update(id: Client['id'], updateClientDto: UpdateClientDto): Promise<Client | null> {
    return this.clientsRepository.update(id, updateClientDto);
  }

  async remove(id: Client['id']): Promise<void> {
    await this.clientsRepository.remove(id);
  }
}
