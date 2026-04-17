/**
 * 预约会话状态
 */
export enum BookingSessionState {
  DRAFT = 'DRAFT',
  SERVICES_SET = 'SERVICES_SET',
  CLIENT_SET = 'CLIENT_SET',
  TIME_SET = 'TIME_SET',
  STAFF_SET = 'STAFF_SET',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}
