import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Appointment } from '../../domain/appointment';

export abstract class AppointmentRepository {
  abstract create(data: Appointment): Promise<Appointment>;

  abstract findManyWithPagination({ paginationOptions }: { paginationOptions: IPaginationOptions }): Promise<{ data: Appointment[]; total: number }>;

  abstract findById(id: string): Promise<NullableType<Appointment>>;

  abstract findByClientId(clientId: Appointment['clientId']): Promise<Appointment[]>;

  abstract findByStaffIdAndDateRange({
    staffId,
    startDate,
    endDate,
  }: {
    staffId: Appointment['staffId'];
    startDate: Date;
    endDate: Date;
  }): Promise<Appointment[]>;

  abstract findByRoomIdAndDateRange({ roomId, startDate, endDate }: { roomId: string; startDate: Date; endDate: Date }): Promise<Appointment[]>;

  abstract findByEquipmentIdAndDateRange({
    equipmentId,
    startDate,
    endDate,
  }: {
    equipmentId: string;
    startDate: Date;
    endDate: Date;
  }): Promise<Appointment[]>;

  abstract findByDateRange({ startDate, endDate }: { startDate: Date; endDate: Date }): Promise<Appointment[]>;

  abstract update(id: string, payload: Partial<Appointment>): Promise<Appointment | null>;

  abstract remove(id: string): Promise<void>;
}
