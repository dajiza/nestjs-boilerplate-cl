import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { StaffRoleService } from './staff-role.service';
import { CreateStaffRoleDto } from './dto/create-staff-role.dto';
import { UpdateStaffRoleDto } from './dto/update-staff-role.dto';

@ApiTags('Staff Roles')
@Controller('staff-roles')
export class StaffRoleController {
  constructor(private readonly service: StaffRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a staff role' })
  create(@Body() dto: CreateStaffRoleDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff roles with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findManyWithPagination({
      paginationOptions: { page: +page, limit: +limit },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a staff role by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a staff role' })
  update(@Param('id') id: string, @Body() dto: UpdateStaffRoleDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a staff role' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
