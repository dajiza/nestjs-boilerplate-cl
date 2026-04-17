import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ServiceCategoryService } from './service-category.service';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@ApiTags('Service Categories')
@Controller('service-categories')
export class ServiceCategoryController {
  constructor(private readonly service: ServiceCategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a service category' })
  create(@Body() dto: CreateServiceCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all service categories with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findManyWithPagination({
      paginationOptions: { page: +page, limit: +limit },
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service category by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a service category' })
  update(@Param('id') id: string, @Body() dto: UpdateServiceCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a service category' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
