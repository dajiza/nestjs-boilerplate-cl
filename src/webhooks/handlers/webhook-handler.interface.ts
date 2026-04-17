export interface WebhookHandler {
  /**
   * 该 handler 支持的 eventType 列表
   */
  supportedEvents: string[];

  /**
   * 处理 webhook 事件
   * @param eventType - 事件类型，如 APPOINTMENT_CREATED
   * @param payload  - 原始 webhook body（包含 data.node 等）
   */
  handle(eventType: string, payload: any): Promise<void>;
}
