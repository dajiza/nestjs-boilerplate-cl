import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryStaffDto } from './dto/query-staff.dto';
import { Staff } from './domain/staff';
import { StaffService } from './staff.service';
import { RolesGuard } from '../roles/roles.guard';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Staff')
@Controller({
  path: 'staff',
  version: '1',
})
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @ApiCreatedResponse({
    type: Staff,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createStaffDto: CreateStaffDto): Promise<Staff> {
    return this.staffService.create(createStaffDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Staff),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryStaffDto): Promise<{ data: Staff[]; total: number }> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return this.staffService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @ApiOkResponse({
    type: Staff,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Staff['id']): Promise<NullableType<Staff>> {
    return this.staffService.findById(id);
  }

  @ApiOkResponse({
    type: Staff,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(@Param('id') id: Staff['id'], @Body() updateStaffDto: UpdateStaffDto): Promise<Staff | null> {
    return this.staffService.update(id, updateStaffDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: Staff['id']): Promise<void> {
    return this.staffService.remove(id);
  }
}
