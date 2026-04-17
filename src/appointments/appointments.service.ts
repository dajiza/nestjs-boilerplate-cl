import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CancelAppointmentDto } from './dto/cancel-appointment.dto';
import { UpdateStateDto } from './dto/update-state.dto';
import { RescheduleAppointmentDto } from './dto/reschedule-appointment.dto';
import { SetNoteDto } from './dto/set-note.dto';
import { AddTagsDto } from './dto/add-tags.dto';
import { RemoveTagsDto } from './dto/remove-tags.dto';
import { RescheduleAvailableDatesDto } from './dto/reschedule-available-dates.dto';
import { RescheduleAvailableTimesDto } from './dto/reschedule-available-times.dto';
import { AppointmentRepository, AppointmentFilterOptions } from './infrastructure/persistence/appointment.repository';
import { Appointment } from './domain/appointment';
import type { BoulevardTag } from '../utils/types/boulevard.types';
import { NullableType } from '../utils/types/nullable.type';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { AppointmentState, isValidTransition, WRITABLE_STATES } from './domain/appointment-state';
import { CancellationReason } from './domain/cancellation-reason';
import { AvailabilityService, StaffAvailability } from '../availability/availability.service';
import { BookingService } from '../booking/booking.service';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentRepository,
    @Inject(forwardRef(() => AvailabilityService))
    private readonly availabilityService: AvailabilityService,
    @Inject(forwardRef(() => BookingService))
    private readonly bookingService: BookingService,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.create({
      id: createAppointmentDto.id,
      startAt: new Date(createAppointmentDto.startAt),
      createdAt: createAppointmentDto.createdAt ? new Date(createAppointmentDto.createdAt) : new Date(),
      cancelled: createAppointmentDto.cancelled,
      appointmentServiceOptions: createAppointmentDto.appointmentServiceOptions ?? [],
      appointmentServiceResources: createAppointmentDto.appointmentServiceResources ?? [],
      appointmentServices: createAppointmentDto.appointmentServices ?? [],
      bookedByType: createAppointmentDto.bookedByType ?? '',
      calendarLinks: createAppointmentDto.calendarLinks ?? {},
      cancellation: createAppointmentDto.cancellation ?? null,
      client: createAppointmentDto.client ?? {},
      clientId: createAppointmentDto.clientId ?? '',
      clientMessage: createAppointmentDto.clientMessage ?? null,
      custom: createAppointmentDto.custom ?? null,
      customFields: createAppointmentDto.customFields ?? [],
      duration: createAppointmentDto.duration ?? 0,
      endAt: createAppointmentDto.endAt ? new Date(createAppointmentDto.endAt) : new Date(),
      isGroupedAppointment: createAppointmentDto.isGroupedAppointment ?? false,
      isRecurring: createAppointmentDto.isRecurring ?? false,
      isRemote: createAppointmentDto.isRemote ?? false,
      location: createAppointmentDto.location ?? {},
      locationId: createAppointmentDto.locationId ?? '',
      manageUrl: createAppointmentDto.manageUrl ?? '',
      notes: createAppointmentDto.notes ?? null,
      notifyClientCancel: createAppointmentDto.notifyClientCancel ?? false,
      notifyClientCreate: createAppointmentDto.notifyClientCreate ?? false,
      orderId: createAppointmentDto.orderId ?? null,
      pendingFormCount: createAppointmentDto.pendingFormCount ?? 0,
      rating: createAppointmentDto.rating ?? null,
      remotePlatforms: createAppointmentDto.remotePlatforms ?? {},
      state: createAppointmentDto.state ?? AppointmentState.BOOKED,
      tags: createAppointmentDto.tags ?? [],
    } as Appointment);

    return appointment;
  }

  findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Appointment[]; total: number }> {
    return this.appointmentsRepository.findManyWithPagination({
      paginationOptions,
    });
  }

  findWithFilters(filters: AppointmentFilterOptions): Promise<{ data: Appointment[]; total: number }> {
    return this.appointmentsRepository.findWithFilters(filters);
  }

  findById(id: string): Promise<NullableType<Appointment>> {
    return this.appointmentsRepository.findById(id);
  }

  findByClientId(clientId: Appointment['clientId']): Promise<Appointment[]> {
    return this.appointmentsRepository.findByClientId(clientId);
  }

  findByStaffIdAndDateRange(staffId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByStaffIdAndDateRange({
      staffId,
      startDate,
      endDate,
    });
  }

  findByStaffIdsAndDateRange(staffIds: string[], startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByStaffIdsAndDateRange({
      staffIds,
      startDate,
      endDate,
    });
  }

  findByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByDateRange({
      startDate,
      endDate,
    });
  }

  findByLocationIdAndDateRange(locationId: string, startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.appointmentsRepository.findByLocationIdAndDateRange({
      locationId,
      startDate,
      endDate,
    });
  }

  async update(id: string, payload: Partial<Appointment>): Promise<Appointment | null> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    const updated = await this.appointmentsRepository.update(id, payload);
    return updated;
  }

  /**
   * 取消预约 -- 软删除（设 cancelled=true），填充 cancellation JSONB
   * 与 Boulevard cancelAppointment 行为一致
   */
  async cancel(id: string, cancelDto: CancelAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    if (appointment.cancelled) {
      throw new BadRequestException(`Appointment #${id} is already cancelled`);
    }

    if (appointment.state === AppointmentState.FINAL) {
      throw new BadRequestException(`Cannot cancel a completed appointment`);
    }

    const now = new Date();
    const cancellation = {
      cancelledAt: now.toISOString(),
      reason: cancelDto.reason,
      notes: cancelDto.notes || null,
    };

    const updated = await this.appointmentsRepository.update(id, {
      cancelled: true,
      state: AppointmentState.CANCELLED,
      cancellation,
      notifyClientCancel: cancelDto.notifyClient ?? true,
    } as Partial<Appointment>);

    return updated!;
  }

  /**
   * 恢复已取消的预约
   */
  async restore(id: string): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    if (!appointment.cancelled) {
      throw new BadRequestException(`Appointment #${id} is not cancelled`);
    }

    const updated = await this.appointmentsRepository.update(id, {
      cancelled: false,
      state: AppointmentState.BOOKED,
      cancellation: null,
    } as Partial<Appointment>);

    return updated!;
  }

  /**
   * 更新预约状态 -- 仅允许在 BOOKED/CONFIRMED/ARRIVED/ACTIVE 之间转换
   * CANCELLED 必须通过 cancel() 方法，FINAL 由结账流程设置
   */
  async updateState(id: string, updateStateDto: UpdateStateDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    if (appointment.cancelled) {
      throw new BadRequestException(`Cannot update state of a cancelled appointment`);
    }

    const currentState = (appointment.state as AppointmentState) || AppointmentState.BOOKED;
    const targetState = updateStateDto.state;

    // 不允许通过此方法设置 CANCELLED 或 FINAL
    if (!WRITABLE_STATES.includes(targetState)) {
      throw new BadRequestException(`Cannot set state to ${targetState} via this endpoint. Use /cancel for CANCELLED.`);
    }

    if (!isValidTransition(currentState, targetState)) {
      throw new BadRequestException(`Invalid state transition: ${currentState} -> ${targetState}`);
    }

    const updated = await this.appointmentsRepository.update(id, {
      state: targetState,
    } as Partial<Appointment>);

    return updated!;
  }

  /**
   * 改期预约 -- 更新 startAt，可选更改员工
   * 可用性验证将在 Phase 1C 可用时段引擎完成后集成
   */
  async reschedule(id: string, rescheduleDto: RescheduleAppointmentDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    if (appointment.cancelled) {
      throw new BadRequestException(`Cannot reschedule a cancelled appointment`);
    }

    if (appointment.state === AppointmentState.FINAL || appointment.state === AppointmentState.ACTIVE) {
      throw new BadRequestException(`Cannot reschedule an appointment in ${appointment.state} state`);
    }

    const newStartAt = new Date(rescheduleDto.startAt);
    const updatePayload: Partial<Appointment> = {
      startAt: newStartAt,
    } as Partial<Appointment>;

    // 如果提供了新的员工 ID，更新 appointmentServices 中的 staffId
    if (rescheduleDto.staffId && appointment.appointmentServices) {
      const services = [...appointment.appointmentServices];
      services[0] = { ...services[0], staffId: rescheduleDto.staffId };
      updatePayload.appointmentServices = services;
    }

    // 重新计算 endAt（保持时长不变）
    if (appointment.endAt && appointment.startAt) {
      const durationMs = appointment.endAt.getTime() - appointment.startAt.getTime();
      updatePayload.endAt = new Date(newStartAt.getTime() + durationMs);
    }

    // 记录改期历史
    const custom = (appointment.custom as Record<string, any>) || {};
    const rescheduleHistory = custom.rescheduleHistory || [];
    rescheduleHistory.push({
      previousStartAt: appointment.startAt.toISOString(),
      newStartAt: newStartAt.toISOString(),
      changedAt: new Date().toISOString(),
      staffChanged: rescheduleDto.staffId ? true : false,
      sendNotification: rescheduleDto.sendNotification ?? true,
    });
    updatePayload.custom = { ...custom, rescheduleHistory };

    const updated = await this.appointmentsRepository.update(id, updatePayload);
    return updated!;
  }

  /**
   * 获取改期可用日期 — 从预约中提取 locationId/serviceId/staffId 后委托 AvailabilityService
   */
  async getRescheduleAvailableDates(id: string, dto: RescheduleAvailableDatesDto): Promise<string[]> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    if (appointment.cancelled) {
      throw new BadRequestException(`Cannot reschedule a cancelled appointment`);
    }

    const { locationId, serviceId, staffId } = this.extractBookingContext(appointment);

    return this.availabilityService.getAvailableDates(locationId, serviceId, staffId, dto.searchRangeLower, dto.searchRangeUpper);
  }

  /**
   * 获取改期可用时段 — 从预约中提取 context 后委托 AvailabilityService
   */
  async getRescheduleAvailableTimes(id: string, dto: RescheduleAvailableTimesDto): Promise<StaffAvailability[]> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    if (appointment.cancelled) {
      throw new BadRequestException(`Cannot reschedule a cancelled appointment`);
    }

    const { locationId, serviceId, staffId } = this.extractBookingContext(appointment);

    return this.availabilityService.getAvailableTimes(locationId, serviceId, dto.date, staffId);
  }

  /**
   * 设置预约备注
   */
  async setNote(id: string, dto: SetNoteDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    const updated = await this.appointmentsRepository.update(id, {
      notes: dto.note ?? null,
    } as Partial<Appointment>);

    return updated!;
  }

  /**
   * 添加标签 — 合并到已有 tags（去重）
   */
  async addTags(id: string, dto: AddTagsDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    const existingTags: BoulevardTag[] = appointment.tags || [];
    const existingIds = new Set(existingTags.map((t) => t.id).filter(Boolean));

    const newTags = dto.tagIds.filter((tagId) => !existingIds.has(tagId)).map((tagId) => ({ id: tagId }));

    const merged = [...existingTags, ...newTags];

    const updated = await this.appointmentsRepository.update(id, {
      tags: merged,
    } as Partial<Appointment>);

    return updated!;
  }

  /**
   * 移除标签 — 从 tags 中移除指定 ID
   */
  async removeTags(id: string, dto: RemoveTagsDto): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    const removeSet = new Set(dto.tagIds);
    const filtered = (appointment.tags || []).filter((t) => t.id != null && !removeSet.has(t.id));

    const updated = await this.appointmentsRepository.update(id, {
      tags: filtered,
    } as Partial<Appointment>);

    return updated!;
  }

  /**
   * 从已有预约创建 Booking Session — 预填充 locationId/clientId/services
   */
  async createBookingFromAppointment(id: string): Promise<any> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment #${id} not found`);
    }

    const { locationId, serviceId, staffId } = this.extractBookingContext(appointment);

    // 创建预填充的 booking session
    const session = await this.bookingService.createFromAppointment({
      locationId,
      clientId: appointment.clientId || undefined,
      serviceId,
      staffId,
      startAt: appointment.startAt.toISOString(),
      notes: appointment.notes || undefined,
    });

    return session;
  }

  /**
   * 从预约中提取 locationId/serviceId/staffId
   */
  private extractBookingContext(appointment: Appointment): {
    locationId: string;
    serviceId: string;
    staffId?: string;
  } {
    const locationId = appointment.locationId;
    if (!locationId) {
      throw new BadRequestException('Appointment has no locationId');
    }

    let serviceId = '';
    let staffId: string | undefined;

    if (appointment.appointmentServices?.length) {
      const firstService = appointment.appointmentServices[0];
      serviceId = firstService.serviceId || '';
      staffId = firstService.staffId || undefined;
    }

    if (!serviceId) {
      throw new BadRequestException('Appointment has no serviceId');
    }

    return { locationId, serviceId, staffId };
  }

  async remove(id: string): Promise<void> {
    await this.appointmentsRepository.remove(id);
  }
}
