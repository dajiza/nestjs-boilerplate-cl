import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { BookingSessionRepository } from './infrastructure/persistence/booking-session.repository';
import { AppointmentsService } from '../appointments/appointments.service';
import { ServicesService } from '../services/services.service';
import { BookingSession } from './domain/booking-session';
import { BookingSessionState } from './domain/booking-session-state';
import { CreateBookingDto } from './dto/create-booking.dto';
import { AddServiceDto } from './dto/add-service.dto';
import { SetClientDto } from './dto/set-client.dto';
import { SetTimeDto } from './dto/set-time.dto';
import { SetStaffDto } from './dto/set-staff.dto';
import { randomUUID } from 'crypto';
import type { AppointmentServiceItem } from '../utils/types/boulevard.types';

const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

@Injectable()
export class BookingService {
  constructor(
    private readonly sessionRepository: BookingSessionRepository,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly servicesService: ServicesService,
  ) {}

  /**
   * 创建预约会话
   */
  async create(dto: CreateBookingDto): Promise<BookingSession> {
    const now = new Date();
    return this.sessionRepository.create({
      id: randomUUID(),
      locationId: dto.locationId,
      clientId: null,
      state: BookingSessionState.DRAFT,
      services: [],
      startAt: null,
      notes: null,
      clientMessage: null,
      expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
      createdAt: now,
      updatedAt: now,
    } as BookingSession);
  }

  /**
   * 获取会话
   */
  async findById(id: string): Promise<BookingSession> {
    const session = await this.sessionRepository.findById(id);
    if (!session) {
      throw new NotFoundException(`Booking session #${id} not found`);
    }
    this.validateNotExpired(session);
    return session;
  }

  /**
   * 添加服务到购物车
   */
  async addService(sessionId: string, dto: AddServiceDto): Promise<BookingSession> {
    const session = await this.findById(sessionId);

    const service = await this.servicesService.findById(dto.serviceId);
    if (!service) {
      throw new NotFoundException(`Service #${dto.serviceId} not found`);
    }

    const services = [...(session.services || [])];
    services.push({
      serviceId: dto.serviceId,
      staffId: dto.staffId || null,
      startTimeOffset: dto.startTimeOffset || 0,
      resources: [],
    });

    return this.sessionRepository.update(sessionId, {
      services,
      state: BookingSessionState.SERVICES_SET,
    }) as Promise<BookingSession>;
  }

  /**
   * 移除服务
   */
  async removeService(sessionId: string, index: number): Promise<BookingSession> {
    const session = await this.findById(sessionId);

    const services = [...(session.services || [])];
    if (index < 0 || index >= services.length) {
      throw new BadRequestException(`Invalid service index: ${index}`);
    }
    services.splice(index, 1);

    const state = services.length > 0 ? BookingSessionState.SERVICES_SET : BookingSessionState.DRAFT;

    return this.sessionRepository.update(sessionId, {
      services,
      state,
    }) as Promise<BookingSession>;
  }

  /**
   * 设置客户
   */
  async setClient(sessionId: string, dto: SetClientDto): Promise<BookingSession> {
    const session = await this.findById(sessionId);

    if (!session.services || session.services.length === 0) {
      throw new BadRequestException('Must add services before setting client');
    }

    return this.sessionRepository.update(sessionId, {
      clientId: dto.clientId,
      state: BookingSessionState.CLIENT_SET,
    }) as Promise<BookingSession>;
  }

  /**
   * 设置开始时间
   */
  async setTime(sessionId: string, dto: SetTimeDto): Promise<BookingSession> {
    const session = await this.findById(sessionId);

    if (!session.clientId) {
      throw new BadRequestException('Must set client before setting time');
    }

    return this.sessionRepository.update(sessionId, {
      startAt: new Date(dto.startAt),
      state: BookingSessionState.TIME_SET,
    }) as Promise<BookingSession>;
  }

  /**
   * 设置员工（为特定服务指定员工）
   */
  async setStaff(sessionId: string, dto: SetStaffDto): Promise<BookingSession> {
    const session = await this.findById(sessionId);

    if (!session.startAt) {
      throw new BadRequestException('Must set time before setting staff');
    }

    const services = [...(session.services || [])];
    if (dto.serviceIndex < 0 || dto.serviceIndex >= services.length) {
      throw new BadRequestException(`Invalid service index: ${dto.serviceIndex}`);
    }

    services[dto.serviceIndex] = {
      ...services[dto.serviceIndex],
      staffId: dto.staffId,
    };

    return this.sessionRepository.update(sessionId, {
      services,
      state: BookingSessionState.STAFF_SET,
    }) as Promise<BookingSession>;
  }

  /**
   * 完成预约 -- 核心方法
   * 验证所有必填字段 -> 计算 duration/endAt -> 构建 appointmentServices -> 创建 Appointment
   */
  async complete(sessionId: string): Promise<BookingSession> {
    const session = await this.findById(sessionId);

    // Validation
    if (!session.services || session.services.length === 0) {
      throw new BadRequestException('Cannot complete: no services added');
    }
    if (!session.clientId) {
      throw new BadRequestException('Cannot complete: client not set');
    }
    if (!session.startAt) {
      throw new BadRequestException('Cannot complete: start time not set');
    }

    // Check all services have staff assigned
    const unassignedIndex = session.services.findIndex((s) => !s.staffId);
    if (unassignedIndex >= 0) {
      throw new BadRequestException(`Cannot complete: service at index ${unassignedIndex} has no staff assigned`);
    }

    // Compute duration from services
    let totalDurationMinutes = 0;
    const appointmentServices: AppointmentServiceItem[] = [];

    for (const svc of session.services) {
      const service = await this.servicesService.findById(svc.serviceId);
      const serviceDuration = service?.defaultDuration || 60; // minutes

      const svcStart = new Date(session.startAt.getTime() + (svc.startTimeOffset || 0) * 60 * 1000);
      const svcEnd = new Date(svcStart.getTime() + serviceDuration * 60 * 1000);

      appointmentServices.push({
        serviceId: svc.serviceId,
        serviceName: service?.name || null,
        staffId: svc.staffId,
        startAt: svcStart.toISOString(),
        endAt: svcEnd.toISOString(),
        startTimeOffset: svc.startTimeOffset || 0,
        duration: serviceDuration,
        totalDuration: serviceDuration,
      });

      totalDurationMinutes = Math.max(totalDurationMinutes, (svc.startTimeOffset || 0) + serviceDuration);
    }

    const durationSeconds = totalDurationMinutes * 60;
    const endAt = new Date(session.startAt.getTime() + durationSeconds * 1000);

    // Create the appointment
    await this.appointmentsService.create({
      startAt: session.startAt.toISOString(),
      cancelled: false,
      clientId: session.clientId,
      locationId: session.locationId,
      duration: durationSeconds,
      endAt: endAt.toISOString(),
      appointmentServices,
      notes: session.notes,
      clientMessage: session.clientMessage,
      state: 'BOOKED',
      bookedByType: 'BACKEND',
    } as any);

    // Mark session completed
    return this.sessionRepository.update(sessionId, {
      state: BookingSessionState.COMPLETED,
    }) as Promise<BookingSession>;
  }

  /**
   * 从已有预约创建预填充的 Booking Session
   * 对应 Boulevard bookingCreateFromAppointment
   */
  async createFromAppointment(params: {
    locationId: string;
    clientId?: string;
    serviceId: string;
    staffId?: string;
    startAt: string;
    notes?: string;
  }): Promise<BookingSession> {
    const now = new Date();
    const session = await this.sessionRepository.create({
      id: randomUUID(),
      locationId: params.locationId,
      clientId: params.clientId || null,
      state: BookingSessionState.SERVICES_SET,
      services: [
        {
          serviceId: params.serviceId,
          staffId: params.staffId || null,
          startTimeOffset: 0,
          resources: [],
        },
      ],
      startAt: new Date(params.startAt),
      notes: params.notes || null,
      clientMessage: null,
      expiresAt: new Date(now.getTime() + SESSION_TTL_MS),
      createdAt: now,
      updatedAt: now,
    } as BookingSession);

    return session;
  }

  /**
   * 放弃/删除会话
   */
  async abandon(sessionId: string): Promise<void> {
    await this.sessionRepository.remove(sessionId);
  }

  /**
   * 清理过期会话
   */
  async cleanExpired(): Promise<number> {
    return this.sessionRepository.cleanExpired();
  }

  private validateNotExpired(session: BookingSession): void {
    if (session.state !== BookingSessionState.COMPLETED && session.expiresAt < new Date()) {
      throw new BadRequestException(`Booking session #${session.id} has expired`);
    }
  }
}
