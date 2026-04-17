import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Appointment } from '../../domain/appointment';
import { AppointmentState } from '../../domain/appointment-state';

export interface AppointmentFilterOptions {
  locationId?: string;
  clientId?: string;
  staffId?: string;
  startDate?: Date;
  endDate?: Date;
  cancelled?: boolean;
  state?: AppointmentState;
  page?: number;
  limit?: number;
}

export abstract class AppointmentRepository {
  abstract create(data: Appointment): Promise<Appointment>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Appointment[]; total: number }>;

  abstract findById(id: string): Promise<NullableType<Appointment>>;

  abstract findByClientId(clientId: Appointment['clientId']): Promise<Appointment[]>;

  abstract findByStaffIdAndDateRange({ staffId, startDate, endDate }: { staffId: string; startDate: Date; endDate: Date }): Promise<Appointment[]>;

  abstract findByStaffIdsAndDateRange({
    staffIds,
    startDate,
    endDate,
  }: {
    staffIds: string[];
    startDate: Date;
    endDate: Date;
  }): Promise<Appointment[]>;

  abstract findByDateRange({ startDate, endDate }: { startDate: Date; endDate: Date }): Promise<Appointment[]>;

  abstract findByLocationIdAndDateRange({
    locationId,
    startDate,
    endDate,
  }: {
    locationId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Appointment[]>;

  abstract findWithFilters(filters: AppointmentFilterOptions): Promise<{ data: Appointment[]; total: number }>;

  abstract update(id: string, payload: Partial<Appointment>): Promise<Appointment | null>;

  abstract remove(id: string): Promise<void>;
}
