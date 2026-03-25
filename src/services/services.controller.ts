import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryServiceDto } from './dto/query-service.dto';
import { Service } from './domain/service';
import { ServicesService } from './services.service';
import { RolesGuard } from '../roles/roles.guard';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Services')
@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiCreatedResponse({
    type: Service,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.servicesService.create(createServiceDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Service),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryServiceDto): Promise<{ data: Service[]; total: number }> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return this.servicesService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @ApiOkResponse({
    type: Service,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Service['id']): Promise<NullableType<Service>> {
    return this.servicesService.findById(id);
  }

  @ApiOkResponse({
    type: Service,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(@Param('id') id: Service['id'], @Body() updateServiceDto: UpdateServiceDto): Promise<Service | null> {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Service['id']): Promise<void> {
    return this.servicesService.remove(id);
  }
}
