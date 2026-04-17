/**
 * 预约状态枚举 -- 与 Boulevard AppointmentState 一致
 */
export enum AppointmentState {
  BOOKED = 'BOOKED',
  CONFIRMED = 'CONFIRMED',
  ARRIVED = 'ARRIVED',
  ACTIVE = 'ACTIVE',
  FINAL = 'FINAL',
  CANCELLED = 'CANCELLED',
}

/**
 * 可通过 updateAppointment 写入的状态（不含 CANCELLED 和 FINAL）
 * 与 Boulevard AppointmentStateInput 一致
 */
export const WRITABLE_STATES: readonly AppointmentState[] = [
  AppointmentState.BOOKED,
  AppointmentState.CONFIRMED,
  AppointmentState.ARRIVED,
  AppointmentState.ACTIVE,
] as const;

/**
 * 状态流转规则：定义每个状态允许的下一状态
 */
const STATE_TRANSITIONS: Record<AppointmentState, AppointmentState[]> = {
  [AppointmentState.BOOKED]: [AppointmentState.CONFIRMED, AppointmentState.CANCELLED],
  [AppointmentState.CONFIRMED]: [AppointmentState.ARRIVED, AppointmentState.CANCELLED],
  [AppointmentState.ARRIVED]: [AppointmentState.ACTIVE, AppointmentState.CANCELLED],
  [AppointmentState.ACTIVE]: [AppointmentState.FINAL, AppointmentState.CANCELLED],
  [AppointmentState.FINAL]: [],
  [AppointmentState.CANCELLED]: [],
};

/**
 * 检查状态转换是否合法
 */
export function isValidTransition(from: AppointmentState, to: AppointmentState): boolean {
  const allowed = STATE_TRANSITIONS[from];
  return allowed ? allowed.includes(to) : false;
}

/**
 * 获取指定状态允许的下一状态列表
 */
export function getAllowedTransitions(current: AppointmentState): AppointmentState[] {
  return STATE_TRANSITIONS[current] ?? [];
}
