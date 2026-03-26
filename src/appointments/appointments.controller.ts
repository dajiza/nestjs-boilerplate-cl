import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { InfinityPaginationResponse } from '../utils/dto/infinity-pagination-response.dto';
import { NullableType } from '../utils/types/nullable.type';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
import { Appointment } from './domain/appointment';
import { AppointmentsService } from './appointments.service';
import { RolesGuard } from '../roles/roles.guard';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Appointments')
@Controller({
  path: 'appointments',
  version: '1',
})
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @ApiCreatedResponse({
    type: Appointment,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @ApiOkResponse({
    type: InfinityPaginationResponse(Appointment),
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: QueryAppointmentDto): Promise<{ data: Appointment[]; total: number }> {
    // If date range provided without staffId/roomId/equipmentId, return all appointments in range
    if (query.startDate && query.endDate && !query.staffId && !query.roomId && !query.equipmentId) {
      const data = await this.appointmentsService.findByDateRange(new Date(query.startDate), new Date(query.endDate));
      return { data, total: data.length };
    }

    // If staffId and date range provided, return filtered appointments
    if (query.staffId && query.startDate && query.endDate) {
      const data = await this.appointmentsService.findByStaffIdAndDateRange(query.staffId, new Date(query.startDate), new Date(query.endDate));
      return { data, total: data.length };
    }

    // If roomId and date range provided, return filtered appointments
    if (query.roomId && query.startDate && query.endDate) {
      const data = await this.appointmentsService.findByRoomIdAndDateRange(query.roomId, new Date(query.startDate), new Date(query.endDate));
      return { data, total: data.length };
    }

    // If equipmentId and date range provided, return filtered appointments
    if (query.equipmentId && query.startDate && query.endDate) {
      const data = await this.appointmentsService.findByEquipmentIdAndDateRange(
        query.equipmentId,
        new Date(query.startDate),
        new Date(query.endDate),
      );
      return { data, total: data.length };
    }

    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return this.appointmentsService.findManyWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
  }

  @ApiOkResponse({
    type: Appointment,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: string): Promise<NullableType<Appointment>> {
    return this.appointmentsService.findById(id);
  }

  @ApiOkResponse({
    type: Appointment,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment | null> {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): Promise<void> {
    return this.appointmentsService.remove(id);
  }
}
