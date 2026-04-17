// 默认使用沙盒环境，生产环境请通过 BOULEVARD_API_ENDPOINT 环境变量配置
export const BOULEVARD_DEFAULT_ENDPOINT = 'https://sandbox.joinblvd.com/api/2020-01/admin';

export const BOULEVARD_PRODUCTION_ENDPOINT = 'https://api.joinblvd.com/api/2020-01/admin';

export enum BoulevardSyncStatus {
  SYNCED = 'SYNCED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  CONFLICT = 'CONFLICT',
}
