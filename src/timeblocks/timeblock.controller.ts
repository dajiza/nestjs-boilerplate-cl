import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { TimeblockService } from './timeblock.service';
import { CreateTimeblockDto } from './dto/create-timeblock.dto';
import { UpdateTimeblockDto } from './dto/update-timeblock.dto';

@ApiTags('Timeblocks')
@Controller('timeblocks')
export class TimeblockController {
  constructor(private readonly service: TimeblockService) {}

  @Post()
  @ApiOperation({ summary: 'Create a timeblock' })
  create(@Body() dto: CreateTimeblockDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timeblocks with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.service.findManyWithPagination({
      paginationOptions: { page: +page, limit: +limit },
    });
  }

  @Get('staff/:staffId')
  @ApiOperation({ summary: 'Get timeblocks by staff ID and date range' })
  @ApiQuery({ name: 'startDate', required: true, type: String })
  @ApiQuery({ name: 'endDate', required: true, type: String })
  findByStaffIdAndDateRange(@Param('staffId') staffId: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.service.findByStaffIdAndDateRange(staffId, new Date(startDate), new Date(endDate));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a timeblock by ID' })
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a timeblock' })
  update(@Param('id') id: string, @Body() dto: UpdateTimeblockDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a timeblock' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
