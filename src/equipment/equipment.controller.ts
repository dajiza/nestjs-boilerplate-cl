import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { EquipmentService } from './equipment.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { Equipment } from './domain/equipment';

@ApiTags('Equipment')
@Controller({
  path: 'equipment',
  version: '1',
})
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create equipment' })
  @ApiResponse({ status: 201, description: 'Equipment created successfully', type: Equipment })
  create(@Body() createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
    return this.equipmentService.create(createEquipmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all equipment' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of equipment' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<{ data: Equipment[]; total: number }> {
    return this.equipmentService.findManyWithPagination({
      paginationOptions: {
        page: page || 1,
        limit: limit || 10,
      },
    });
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get equipment by service ID' })
  @ApiResponse({ status: 200, description: 'List of equipment for service' })
  findByServiceId(@Param('serviceId') serviceId: string): Promise<Equipment[]> {
    return this.equipmentService.findByServiceId(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get equipment by ID' })
  @ApiResponse({ status: 200, description: 'Equipment details', type: Equipment })
  @ApiResponse({ status: 404, description: 'Equipment not found' })
  findOne(@Param('id') id: string): Promise<Equipment | null> {
    return this.equipmentService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update equipment' })
  @ApiResponse({ status: 200, description: 'Equipment updated successfully', type: Equipment })
  @ApiResponse({ status: 404, description: 'Equipment not found' })
  update(@Param('id') id: string, @Body() updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment | null> {
    return this.equipmentService.update(id, updateEquipmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete equipment' })
  @ApiResponse({ status: 204, description: 'Equipment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Equipment not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.equipmentService.remove(id);
  }
}
