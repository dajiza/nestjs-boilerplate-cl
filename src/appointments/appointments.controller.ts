import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { RescheduleAvailableDatesDto } from './dto/reschedule-available-dates.dto';
import { RescheduleAvailableTimesDto } from './dto/reschedule-available-times.dto';
import { SetNoteDto } from './dto/set-note.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { RemoveTagsDto } from './dto/remove-tags.dto';
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
import { StaffAvailability } from '../availability/availability.service';
import { AppointmentState, isValidTransition, WRITABLE_STATES } from './domain/appointment-state';

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
    const hasFilters =
      query.locationId || query.clientId || query.staffId || query.startDate || query.endDate || query.cancelled !== undefined || query.state;

    if (hasFilters) {
      return this.appointmentsService.findWithFilters({
        locationId: query.locationId,
        clientId: query.clientId,
        staffId: query.staffId,
        startDate: query.startDate ? new Date(query.startDate) : undefined,
        endDate: query.endDate ? new Date(query.endDate) : undefined,
        cancelled: query.cancelled,
        state: query.state,
        page: query.page,
        limit: query.limit,
      });
    }

    return this.appointmentsService.findManyWithPagination({
      paginationOptions: {
        page: query?.page ?? 1,
        limit: Math.min(query?.limit ?? 10, 50),
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
  async update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto): Promise<Appointment | null> {
    const appointment = await this.appointmentsService.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
    if (appointment.cancelled) {
      throw new BadRequestException('Cannot update a cancelled appointment');
    }

    const payload: Partial<Appointment> = {};
    if (dto.notes !== undefined) payload.notes = dto.notes;
    if (dto.customFields !== undefined) payload.customFields = dto.customFields ?? undefined;
    if (dto.state !== undefined) {
      if (!WRITABLE_STATES.includes(dto.state)) {
        throw new BadRequestException(`Cannot set state to ${dto.state} via this endpoint. Use /cancel for CANCELLED.`);
      }
      const current = (appointment.state as AppointmentState) || AppointmentState.BOOKED;
      if (!isValidTransition(current, dto.state)) {
        throw new BadRequestException(`Invalid state transition: ${current} -> ${dto.state}`);
      }
      payload.state = dto.state;
    }

    return this.appointmentsService.update(id, payload);
  }

  /**
   * 取消预约 -- 软删除（与 Boulevard cancelAppointment 行为一致）
   */
  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Appointment })
  cancel(@Param('id') id: string, @Body() cancelDto: CancelAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.cancel(id, cancelDto);
  }

  /**
   * 恢复已取消的预约
   */
  @Post(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Appointment })
  restore(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.restore(id);
  }

  /**
   * 改期预约 -- 更新开始时间，可选更改员工
   */
  @Post(':id/reschedule')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Appointment })
  reschedule(@Param('id') id: string, @Body() rescheduleDto: RescheduleAppointmentDto): Promise<Appointment> {
    return this.appointmentsService.reschedule(id, rescheduleDto);
  }

  /**
   * 更新预约状态 -- 仅限 BOOKED/CONFIRMED/ARRIVED/ACTIVE
   * CANCELLED 必须通过 /cancel 端点
   */
  @Patch(':id/state')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Appointment })
  updateState(@Param('id') id: string, @Body() updateStateDto: UpdateStateDto): Promise<Appointment> {
    return this.appointmentsService.updateState(id, updateStateDto);
  }

  /**
   * 改期可用日期 — 从预约提取 context 后查询 AvailabilityService
   */
  @Post(':id/reschedule/available-dates')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: [String] })
  getRescheduleAvailableDates(@Param('id') id: string, @Body() dto: RescheduleAvailableDatesDto): Promise<string[]> {
    return this.appointmentsService.getRescheduleAvailableDates(id, dto);
  }

  /**
   * 改期可用时段 — 从预约提取 context 后查询 AvailabilityService
   */
  @Post(':id/reschedule/available-times')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  getRescheduleAvailableTimes(@Param('id') id: string, @Body() dto: RescheduleAvailableTimesDto): Promise<StaffAvailability[]> {
    return this.appointmentsService.getRescheduleAvailableTimes(id, dto);
  }

  /**
   * 设置/清除预约备注 — 对应 Boulevard bookingSetAppointmentNote
   */
  @Patch(':id/note')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Appointment })
  setNote(@Param('id') id: string, @Body() dto: SetNoteDto): Promise<Appointment> {
    return this.appointmentsService.setNote(id, dto);
  }

  /**
   * 添加标签 — 对应 Boulevard bookingAddAppointmentTags
   */
  @Post(':id/tags')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Appointment })
  addTags(@Param('id') id: string, @Body() dto: AddTagsDto): Promise<Appointment> {
    return this.appointmentsService.addTags(id, dto);
  }

  /**
   * 移除标签 — 对应 Boulevard bookingRemoveAppointmentTags
   */
  @Delete(':id/tags')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String, required: true })
  @ApiOkResponse({ type: Appointment })
  removeTags(@Param('id') id: string, @Body() dto: RemoveTagsDto): Promise<Appointment> {
    return this.appointmentsService.removeTags(id, dto);
  }

  /**
   * 从预约创建 Booking Session — 对应 Boulevard bookingCreateFromAppointment
   */
  @Post(':id/create-booking')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'id', type: String, required: true })
  createBookingFromAppointment(@Param('id') id: string): Promise<any> {
    return this.appointmentsService.createBookingFromAppointment(id);
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
