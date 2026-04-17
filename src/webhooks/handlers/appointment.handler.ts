import { Injectable, Logger } from '@nestjs/common';
import { WebhookHandler } from './webhook-handler.interface';
import { AppointmentsService } from '../../appointments/appointments.service';
import { AppointmentState } from '../../appointments/domain/appointment-state';

/**
 * eventType → AppointmentState 映射
 *
 * Boulevard webhook payload 中不包含 state 字段，
 * 需要根据 eventType 推导出对应状态。
 */
const EVENT_TYPE_TO_STATE: Record<string, AppointmentState> = {
  APPOINTMENT_CREATED: AppointmentState.BOOKED,
  APPOINTMENT_CONFIRMED: AppointmentState.CONFIRMED,
  APPOINTMENT_ARRIVED: AppointmentState.ARRIVED,
  APPOINTMENT_ACTIVE: AppointmentState.ACTIVE,
  APPOINTMENT_COMPLETED: AppointmentState.FINAL,
  APPOINTMENT_CANCELLED: AppointmentState.CANCELLED,
  APPOINTMENT_UPDATED: AppointmentState.BOOKED, // 默认值，如已存在则保留当前 state
  APPOINTMENT_RESCHEDULED: AppointmentState.BOOKED, // 同上
};

@Injectable()
export class AppointmentWebhookHandler implements WebhookHandler {
  private readonly logger = new Logger(AppointmentWebhookHandler.name);

  supportedEvents = [
    'APPOINTMENT_CREATED',
    'APPOINTMENT_UPDATED',
    'APPOINTMENT_CANCELLED',
    'APPOINTMENT_COMPLETED',
    'APPOINTMENT_CONFIRMED',
    'APPOINTMENT_ARRIVED',
    'APPOINTMENT_ACTIVE',
    'APPOINTMENT_RESCHEDULED',
  ];

  constructor(private readonly appointmentsService: AppointmentsService) {}

  async handle(eventType: string, payload: any): Promise<void> {
    const node = payload?.data?.node;
    if (!node?.id) {
      this.logger.warn(`No data.node or id in payload, skipping: ${eventType}`);
      return;
    }

    this.logger.log(`Processing ${eventType} for appointment ${node.id}`);

    const existing = await this.appointmentsService.findById(node.id);

    // 确定 state：优先用 eventType 映射
    // 对于 UPDATED / RESCHEDULED，如果本地已有记录则保留当前 state
    let state: string;
    if ((eventType === 'APPOINTMENT_UPDATED' || eventType === 'APPOINTMENT_RESCHEDULED') && existing?.state) {
      state = existing.state;
    } else {
      state = EVENT_TYPE_TO_STATE[eventType] ?? AppointmentState.BOOKED;
    }

    // cancelled 标志
    const cancelled = eventType === 'APPOINTMENT_CANCELLED' ? true : (existing?.cancelled ?? false);

    // 构建 appointment 数据
    const appointmentData = {
      startAt: node.startAt ? new Date(node.startAt) : new Date(),
      createdAt: existing?.createdAt ?? new Date(),
      cancelled,
      appointmentServices: node.appointmentServices ?? null,
      bookedByType: node.bookedByType ?? null,
      cancellation: node.cancellation ?? null,
      client: node.client ?? null,
      clientId: node.clientId ?? node.client?.id ?? null,
      duration: node.duration ?? null,
      endAt: node.endAt ? new Date(node.endAt) : null,
      location: node.location ?? null,
      locationId: node.locationId ?? node.location?.id ?? null,
      notes: node.notes ?? null,
      orderId: node.orderId ?? null,
      state,
      tags: node.tags ? (Array.isArray(node.tags) ? node.tags.map((t: any) => (typeof t === 'string' ? { name: t } : t)) : null) : null,
    };

    if (existing) {
      await this.appointmentsService.update(node.id, appointmentData as any);
      this.logger.log(`Updated appointment ${node.id} from ${eventType}`);
    } else {
      await this.appointmentsService.create({
        id: node.id,
        ...appointmentData,
      });
      this.logger.log(`Created appointment ${node.id} from ${eventType}`);
    }
  }
}
