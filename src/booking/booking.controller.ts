import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddServiceDto, RemoveServiceDto } from './dto/add-service.dto';
import { SetClientDto } from './dto/set-client.dto';
import { SetTimeDto } from './dto/set-time.dto';
import { SetStaffDto } from './dto/set-staff.dto';
import { BookingSessionDto } from './dto/booking.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Booking')
@Controller({
  path: 'booking',
  version: '1',
})
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: BookingSessionDto })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingService.create(dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: BookingSessionDto })
  findById(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }

  @Post(':id/services')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: BookingSessionDto })
  addService(@Param('id') id: string, @Body() dto: AddServiceDto) {
    return this.bookingService.addService(id, dto);
  }

  @Delete(':id/services/:index')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiParam({ name: 'index', type: Number, required: true })
  @ApiOkResponse({ type: BookingSessionDto })
  removeService(@Param('id') id: string, @Param('index') index: number) {
    return this.bookingService.removeService(id, Number(index));
  }

  @Patch(':id/client')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: BookingSessionDto })
  setClient(@Param('id') id: string, @Body() dto: SetClientDto) {
    return this.bookingService.setClient(id, dto);
  }

  @Patch(':id/time')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: BookingSessionDto })
  setTime(@Param('id') id: string, @Body() dto: SetTimeDto) {
    return this.bookingService.setTime(id, dto);
  }

  @Patch(':id/staff')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: BookingSessionDto })
  setStaff(@Param('id') id: string, @Body() dto: SetStaffDto) {
    return this.bookingService.setStaff(id, dto);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: BookingSessionDto })
  complete(@Param('id') id: string) {
    return this.bookingService.complete(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiParam({ name: 'id', type: String, required: true })
  abandon(@Param('id') id: string) {
    return this.bookingService.abandon(id);
  }
}
