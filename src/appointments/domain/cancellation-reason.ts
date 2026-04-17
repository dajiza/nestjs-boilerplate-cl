/**
 * 取消原因枚举 -- 与 Boulevard AppointmentCancellationReason 一致
 */
export enum CancellationReason {
  CLIENT_CANCEL = 'CLIENT_CANCEL',
  CLIENT_LATE_CANCEL = 'CLIENT_LATE_CANCEL',
  STAFF_CANCEL = 'STAFF_CANCEL',
  NO_SHOW = 'NO_SHOW',
  MISTAKE = 'MISTAKE',
  MERGED = 'MERGED',
  OFFBOARDED = 'OFFBOARDED',
  VOIDED = 'VOIDED',
}
