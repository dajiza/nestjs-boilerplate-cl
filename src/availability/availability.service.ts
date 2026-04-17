import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { ShiftService } from '../shifts/shift.service';
import { TimeblockService } from '../timeblocks/timeblock.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { LocationService } from '../locations/location.service';
import { ServicesService } from '../services/services.service';
import { StaffService } from '../staff/staff.service';

/**
 * 时间窗口：[start, end) 区间
 */
interface TimeWindow {
  start: Date;
  end: Date;
}

/**
 * 可用时段
 */
export interface AvailableSlot {
  startAt: string; // ISO 8601
  endAt: string; // ISO 8601
  staffIds: string[];
}

/**
 * 员工可用性
 */
export interface StaffAvailability {
  staffId: string;
  staffName: string;
  availableSlots: AvailableSlot[];
}

@Injectable()
export class AvailabilityService {
  constructor(
    private readonly locationService: LocationService,
    private readonly shiftService: ShiftService,
    private readonly timeblockService: TimeblockService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly servicesService: ServicesService,
    private readonly staffService: StaffService,
  ) {}

  /**
   * 获取可预约日期列表
   */
  async getAvailableDates(
    locationId: string,
    serviceId: string,
    staffId?: string,
    searchRangeLower?: string,
    searchRangeUpper?: string,
  ): Promise<string[]> {
    const location = await this.locationService.findById(locationId);
    if (!location) {
      throw new NotFoundException(`Location #${locationId} not found`);
    }

    const service = await this.servicesService.findById(serviceId);
    if (!service) {
      throw new NotFoundException(`Service #${serviceId} not found`);
    }

    const lowerDate = searchRangeLower ? new Date(searchRangeLower) : new Date();
    const upperDate = searchRangeUpper ? new Date(searchRangeUpper) : new Date(lowerDate.getTime() + 30 * 24 * 60 * 60 * 1000); // default 30 days

    const serviceDuration = service.defaultDuration || 60; // minutes
    const availableDates: string[] = [];

    // Iterate day by day
    const current = new Date(lowerDate);
    current.setHours(0, 0, 0, 0);
    const end = new Date(upperDate);
    end.setHours(23, 59, 59, 999);

    while (current <= end) {
      const slots = await this.getAvailableSlotsForDate(locationId, serviceId, current, staffId, serviceDuration);

      if (slots.length > 0) {
        availableDates.push(current.toISOString().split('T')[0]);
      }

      current.setDate(current.getDate() + 1);
    }

    return availableDates;
  }

  /**
   * 获取指定日期的可用时段
   */
  async getAvailableTimes(locationId: string, serviceId: string, date: string, staffId?: string): Promise<StaffAvailability[]> {
    const location = await this.locationService.findById(locationId);
    if (!location) {
      throw new NotFoundException(`Location #${locationId} not found`);
    }

    const service = await this.servicesService.findById(serviceId);
    if (!service) {
      throw new NotFoundException(`Service #${serviceId} not found`);
    }

    const serviceDuration = service.defaultDuration || 60; // minutes
    const targetDate = new Date(date);

    // Get active staff at this location
    const staffIds = staffId ? [staffId] : await this.getStaffIdsForLocation(locationId);

    if (staffIds.length === 0) {
      return [];
    }

    const results: StaffAvailability[] = [];

    for (const sId of staffIds) {
      const slots = await this.getAvailableSlotsForDate(locationId, serviceId, targetDate, sId, serviceDuration);

      if (slots.length > 0) {
        const staff = await this.staffService.findById(sId);
        results.push({
          staffId: sId,
          staffName: staff?.name || sId,
          availableSlots: slots,
        });
      }
    }

    return results;
  }

  /**
   * 获取指定时段的可用员工
   */
  async getAvailableStaff(
    locationId: string,
    serviceId: string,
    startAt: string,
    durationMinutes?: number,
  ): Promise<Array<{ staffId: string; staffName: string }>> {
    const location = await this.locationService.findById(locationId);
    if (!location) {
      throw new NotFoundException(`Location #${locationId} not found`);
    }

    const service = await this.servicesService.findById(serviceId);
    if (!service) {
      throw new NotFoundException(`Service #${serviceId} not found`);
    }

    const serviceDuration = durationMinutes || service.defaultDuration || 60;
    const startDate = new Date(startAt);
    const endDate = new Date(startDate.getTime() + serviceDuration * 60 * 1000);

    const staffIds = await this.getStaffIdsForLocation(locationId);
    const availableStaff: Array<{ staffId: string; staffName: string }> = [];

    for (const sId of staffIds) {
      const isAvailable = await this.isStaffAvailable(sId, locationId, startDate, endDate);

      if (isAvailable) {
        const staff = await this.staffService.findById(sId);
        availableStaff.push({
          staffId: sId,
          staffName: staff?.name || sId,
        });
      }
    }

    return availableStaff;
  }

  /**
   * 核心方法：获取指定员工在某天的可用时段
   */
  private async getAvailableSlotsForDate(
    locationId: string,
    serviceId: string,
    date: Date,
    staffId: string | undefined,
    serviceDurationMinutes: number,
  ): Promise<AvailableSlot[]> {
    if (!staffId) {
      // No specific staff: check if any staff has availability
      const allStaffIds = await this.getStaffIdsForLocation(locationId);
      if (allStaffIds.length === 0) return [];

      // Collect all available slots across staff, then merge
      const allSlots: AvailableSlot[] = [];
      for (const sId of allStaffIds) {
        const slots = await this.getAvailableSlotsForDate(locationId, serviceId, date, sId, serviceDurationMinutes);
        allSlots.push(...slots);
      }

      // Sort and deduplicate
      allSlots.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
      return allSlots;
    }

    // Date boundaries for the day
    const dayStr = date.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Step 1: Get staff shifts for the day
    const shifts = await this.shiftService.findByStaffIdAndDateRange(staffId, dayStr, dayStr);

    // Only available shifts
    const availableShifts = shifts.filter((s) => s.available);

    if (availableShifts.length === 0) {
      return []; // No available shifts = no availability
    }

    // Step 2: Build available windows from shifts (startTime/endTime are time strings like "09:00:00")
    let windows: TimeWindow[] = availableShifts.map((shift) => {
      const start = new Date(`${shift.date}T${shift.startTime}`);
      const end = new Date(`${shift.date}T${shift.endTime}`);
      return { start, end };
    });

    // Step 3: Subtract timeblocks (all timeblocks are blocked time in Boulevard)
    const timeblocks = await this.timeblockService.findByStaffIdAndDateRange(staffId, new Date(dayStr), new Date(dayStr));

    for (const block of timeblocks) {
      const blockStart = new Date(block.startAt);
      const blockEnd = new Date(block.endAt);

      windows = this.subtractWindow(windows, { start: blockStart, end: blockEnd });
    }

    // Step 4: Subtract existing appointments
    const appointments = await this.appointmentsService.findByStaffIdAndDateRange(staffId, new Date(dayStr), new Date(dayStr));

    for (const apt of appointments) {
      if (apt.cancelled) continue;

      const aptStart = new Date(apt.startAt);
      const aptEnd = apt.endAt ? new Date(apt.endAt) : new Date(aptStart.getTime() + (apt.duration || 3600) * 1000);

      // Add buffer from appointmentServices (postStaffDuration in minutes)
      let bufferMinutes = 0;
      if (apt.appointmentServices && Array.isArray(apt.appointmentServices)) {
        for (const svc of apt.appointmentServices) {
          bufferMinutes = Math.max(bufferMinutes, (svc.postStaffDuration || 0) + (svc.finishDuration || 0));
        }
      }

      const bufferedEnd = new Date(aptEnd.getTime() + bufferMinutes * 60 * 1000);
      windows = this.subtractWindow(windows, { start: aptStart, end: bufferedEnd });
    }

    // Step 5: Apply scheduling rules (min lead time = 2 hours by default)
    const now = new Date();
    const minLeadTimeMs = 2 * 60 * 60 * 1000; // 2 hours
    const earliestStart = new Date(now.getTime() + minLeadTimeMs);

    windows = windows
      .map((w) => {
        if (w.start < earliestStart) {
          return { start: earliestStart, end: w.end };
        }
        return w;
      })
      .filter((w) => w.start < w.end);

    // Step 6: Divide into slots
    const slotDurationMs = serviceDurationMinutes * 60 * 1000;
    const slots: AvailableSlot[] = [];

    for (const window of windows) {
      let slotStart = new Date(window.start);

      while (slotStart.getTime() + slotDurationMs <= window.end.getTime()) {
        const slotEnd = new Date(slotStart.getTime() + slotDurationMs);
        slots.push({
          startAt: slotStart.toISOString(),
          endAt: slotEnd.toISOString(),
          staffIds: [staffId],
        });
        slotStart = slotEnd;
      }
    }

    return slots;
  }

  /**
   * 检查员工在指定时段是否可用
   */
  async isStaffAvailable(staffId: string, locationId: string, startDate: Date, endDate: Date): Promise<boolean> {
    // Format dates as strings for the new Shift API
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Check if staff has an available shift covering this period
    const shifts = await this.shiftService.findByStaffIdAndDateRange(staffId, startDateStr, endDateStr);

    const availableShifts = shifts.filter((s) => s.available);
    const coveredByShift = availableShifts.some((s) => {
      const shiftStart = new Date(`${s.date}T${s.startTime}`);
      const shiftEnd = new Date(`${s.date}T${s.endTime}`);
      return shiftStart <= startDate && shiftEnd >= endDate;
    });

    if (!coveredByShift) return false;

    // Check for timeblocks
    const timeblocks = await this.timeblockService.findByStaffIdAndDateRange(staffId, new Date(startDateStr), new Date(endDateStr));

    // All timeblocks are blocked time in Boulevard
    const hasBlockingTimeblock = timeblocks.some((tb) => {
      const tbStart = new Date(tb.startAt);
      const tbEnd = new Date(tb.endAt);
      return tbStart < endDate && tbEnd > startDate; // Overlap check
    });

    if (hasBlockingTimeblock) return false;

    // Check for existing appointments
    const appointments = await this.appointmentsService.findByStaffIdAndDateRange(staffId, new Date(startDateStr), new Date(endDateStr));

    const hasConflict = appointments.some((apt) => {
      if (apt.cancelled) return false;
      const aptStart = new Date(apt.startAt);
      const aptEnd = apt.endAt ? new Date(apt.endAt) : new Date(aptStart.getTime() + (apt.duration || 3600) * 1000);
      return aptStart < endDate && aptEnd > startDate; // Overlap check
    });

    return !hasConflict;
  }

  /**
   * 获取门店下的活跃员工 ID 列表
   */
  private async getStaffIdsForLocation(locationId: string): Promise<string[]> {
    try {
      const { data } = await this.staffService.findManyWithPagination({
        paginationOptions: { page: 1, limit: 100 },
      });
      return data.filter((s) => s.active !== false).map((s) => s.id);
    } catch {
      return [];
    }
  }

  /**
   * 从时间窗口中减去一个区间
   */
  private subtractWindow(windows: TimeWindow[], subtract: TimeWindow): TimeWindow[] {
    const result: TimeWindow[] = [];

    for (const w of windows) {
      // No overlap
      if (subtract.end <= w.start || subtract.start >= w.end) {
        result.push(w);
        continue;
      }

      // Subtract in the middle: split into two
      if (subtract.start > w.start && subtract.end < w.end) {
        result.push({ start: w.start, end: subtract.start });
        result.push({ start: subtract.end, end: w.end });
        continue;
      }

      // Subtract covers left part
      if (subtract.start <= w.start && subtract.end < w.end) {
        result.push({ start: subtract.end, end: w.end });
        continue;
      }

      // Subtract covers right part
      if (subtract.start > w.start && subtract.end >= w.end) {
        result.push({ start: w.start, end: subtract.start });
        continue;
      }

      // Subtract covers entire window: nothing to add
    }

    return result;
  }
}
