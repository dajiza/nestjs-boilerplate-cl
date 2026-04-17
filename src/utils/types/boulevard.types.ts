/**
 * Boulevard API 嵌套对象的类型定义
 * 仅覆盖业务逻辑中实际访问了内部属性的字段
 * 纯透传字段保持 Record<string, any> 不变
 */

/**
 * Appointment 内嵌的 client 摘要 — 业务逻辑访问 .id
 */
export interface AppointmentClientSummary {
  id: string;
  [key: string]: unknown;
}

/**
 * Tag 结构 — 业务逻辑访问 .id, .name
 */
export interface BoulevardTag {
  id?: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * AppointmentService 内嵌的服务项 — 业务逻辑访问 .serviceId, .staffId, .postStaffDuration 等
 */
export interface AppointmentServiceItem {
  serviceId?: string | null;
  staffId?: string | null;
  serviceName?: string | null;
  startAt?: string;
  endAt?: string;
  startTimeOffset?: number;
  duration?: number;
  totalDuration?: number;
  postStaffDuration?: number;
  finishDuration?: number;
  [key: string]: unknown;
}

// ─── Shared ────────────────────────────────────────────────

/**
 * Address — 被 Business, Location 共用
 */
export interface Address {
  city?: string | null;
  country?: string | null;
  line1?: string | null;
  line2?: string | null;
  province?: string | null;
  state?: string | null;
  zip?: string | null;
  [key: string]: unknown;
}

/**
 * Location 摘要 — 被 Appointment, Client, Shift, Timeblock, Staff 共用
 */
export interface BoulevardLocationSummary {
  id: string;
  name?: string;
  [key: string]: unknown;
}

/**
 * Staff 摘要 — 被 Shift, Timeblock 共用
 */
export interface StaffSummary {
  id: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  [key: string]: unknown;
}

/**
 * StaffRole 摘要 — 被 Staff 引用
 */
export interface StaffRoleSummary {
  id: string;
  name: string;
  [key: string]: unknown;
}

/**
 * AppRole 摘要 — 被 Staff 引用
 */
export interface AppRoleSummary {
  id: string;
  name: string;
  description?: string;
  [key: string]: unknown;
}

// ─── Appointment ───────────────────────────────────────────

/**
 * AppointmentServiceOption — 预约服务选项
 */
export interface AppointmentServiceOption {
  id: string;
  appointmentServiceId: string;
  serviceOptionId: string;
  durationDelta?: number;
  finishDurationDelta?: number;
  postClientDurationDelta?: number;
  postStaffDurationDelta?: number;
  priceDelta?: number;
  productId?: string | null;
  productName?: string | null;
  quantity?: number | null;
  [key: string]: unknown;
}

/**
 * AppointmentServiceResource — 预约服务资源
 */
export interface AppointmentServiceResource {
  id: string;
  appointmentServiceId: string;
  resourceId: string;
  resource?: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

/**
 * CalendarLinks — 日历链接
 */
export interface CalendarLinks {
  googleCalendar: string;
  icsDownload: string;
  microsoftOffice: string;
  microsoftOutlook: string;
  [key: string]: unknown;
}

/**
 * AppointmentCancellation — 取消信息
 */
export interface AppointmentCancellation {
  cancelledAt: string;
  reason: string;
  notes?: string | null;
  [key: string]: unknown;
}

/**
 * AppointmentRating — 评分
 */
export interface AppointmentRating {
  rating: number;
  text?: string | null;
  insertedAt?: string;
  [key: string]: unknown;
}

/**
 * RemotePlatforms — 远程平台
 */
export interface RemotePlatforms {
  microsoftTeams?: {
    url: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// ─── Client ────────────────────────────────────────────────

/**
 * CreditCard — 客户信用卡
 */
export interface CreditCard {
  brand?: string | null;
  last4?: string | null;
  expirationMonth?: number | null;
  expirationYear?: number | null;
  [key: string]: unknown;
}

/**
 * MarketingSetting — 营销设置
 */
export interface MarketingSetting {
  email: boolean;
  push: boolean;
  sms: boolean;
  type: string;
  [key: string]: unknown;
}

/**
 * ClientNote — 客户备注
 */
export interface ClientNote {
  id: string;
  text: string;
  createdAt?: string;
  insertedAt?: string;
  [key: string]: unknown;
}

/**
 * ReminderSetting — 提醒设置
 */
export interface ReminderSetting {
  email: boolean;
  push: boolean;
  sms: boolean;
  type: string;
  [key: string]: unknown;
}

// ─── Location ──────────────────────────────────────────────

/**
 * LocationHours — 营业时间
 */
export interface LocationHours {
  hour?: number | null;
  minute?: number | null;
}

/**
 * LocationDays — 营业日
 */
export interface LocationDays {
  open?: boolean | null;
  start?: LocationHours;
  finish?: LocationHours;
  [key: string]: unknown;
}

/**
 * PaymentOption — 支付选项
 */
export interface PaymentOption {
  id: string;
  name: string;
  active: boolean;
  [key: string]: unknown;
}

// ─── Service ───────────────────────────────────────────────

/**
 * ServiceAddon — 服务附加项
 */
export interface ServiceAddon {
  id: string;
  alias?: string | null;
  description?: string | null;
  [key: string]: unknown;
}

/**
 * ServiceCategorySummary — 服务分类摘要
 */
export interface ServiceCategorySummary {
  id: string;
  name: string;
  [key: string]: unknown;
}

/**
 * ServiceOptionGroup — 服务选项组
 */
export interface ServiceOptionGroup {
  id: string;
  name: string;
  description?: string | null;
  maxLimit?: number | null;
  minLimit?: number | null;
  serviceId: string;
  [key: string]: unknown;
}

/**
 * ServiceOverride — 服务覆盖
 */
export interface ServiceOverride {
  duration: number;
  finishDuration: number;
  postClientDuration: number;
  postStaffDuration: number;
  price: number;
  [key: string]: unknown;
}

/**
 * ServiceStatus — 服务状态
 */
export interface ServiceStatus {
  active: boolean;
  bookable: boolean;
  [key: string]: unknown;
}

// ─── Staff ─────────────────────────────────────────────────

/**
 * StaffLocationAbilities — 员工门店权限
 */
export interface StaffLocationAbilities {
  editLoyaltyPointHistory: boolean;
  viewLoyaltyPointHistory: boolean;
  [key: string]: unknown;
}

// ─── Shift ─────────────────────────────────────────────────

/**
 * ShiftRecurrence — 班次重复规则
 */
export interface ShiftRecurrence {
  frequency: string;
  until?: string | null;
  [key: string]: unknown;
}
