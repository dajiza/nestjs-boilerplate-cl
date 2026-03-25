import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryClientDto } from './dto/query-client.dto';
import { Client } from './domain/client';
import { ClientsService } from './clients.service';
import { RolesGuard } from '../roles/roles.guard';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Clients')
@Controller({
  path: 'clients',
  version: '1',
})
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @ApiCreatedResponse({
    type: Client,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createClientDto: CreateClientDto): Promise<Client> {
    return this.clientsService.create(createClientDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Client),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryClientDto): Promise<{ data: Client[]; total: number }> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return this.clientsService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @ApiOkResponse({
    type: Client,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Client['id']): Promise<NullableType<Client>> {
    return this.clientsService.findById(id);
  }

  @ApiOkResponse({
    type: Client,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(@Param('id') id: Client['id'], @Body() updateClientDto: UpdateClientDto): Promise<Client | null> {
    return this.clientsService.update(id, updateClientDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Client['id']): Promise<void> {
    return this.clientsService.remove(id);
  }
}
