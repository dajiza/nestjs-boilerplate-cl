import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './domain/room';

@ApiTags('Rooms')
@Controller({
  path: 'rooms',
  version: '1',
})
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @ApiOperation({ summary: 'Create room' })
  @ApiResponse({ status: 201, description: 'Room created successfully', type: Room })
  create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rooms' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of rooms' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number): Promise<{ data: Room[]; total: number }> {
    return this.roomsService.findManyWithPagination({
      paginationOptions: {
        page: page || 1,
        limit: limit || 10,
      },
    });
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get rooms by service ID' })
  @ApiResponse({ status: 200, description: 'List of rooms for service' })
  findByServiceId(@Param('serviceId') serviceId: string): Promise<Room[]> {
    return this.roomsService.findByServiceId(serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get room by ID' })
  @ApiResponse({ status: 200, description: 'Room details', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  findOne(@Param('id') id: string): Promise<Room | null> {
    return this.roomsService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update room' })
  @ApiResponse({ status: 200, description: 'Room updated successfully', type: Room })
  @ApiResponse({ status: 404, description: 'Room not found' })
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto): Promise<Room | null> {
    return this.roomsService.update(id, updateRoomDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete room' })
  @ApiResponse({ status: 204, description: 'Room deleted successfully' })
  @ApiResponse({ status: 404, description: 'Room not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.roomsService.remove(id);
  }
}
