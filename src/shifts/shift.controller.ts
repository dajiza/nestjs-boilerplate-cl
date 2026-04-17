import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';

@ApiTags('Shifts')
@Controller('shifts')
export class ShiftController {
  constructor(private readonly service: ShiftService) {}

  @Post()
  @ApiOperation({ summary: 'Create a shift' })
  create(@Body() dto: CreateShiftDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shifts with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findManyWithPagination({
      paginationOptions: { page: +page, limit: +limit },
    });
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get shifts by staff ID and date range' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  findByStaffIdAndDateRange(@Param('staffId') staffId: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.findByStaffIdAndDateRange(staffId, startDate, endDate);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shift by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shift' })
  update(@Param('id') id: string, @Body() dto: UpdateShiftDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shift' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
