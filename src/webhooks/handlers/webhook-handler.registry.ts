import { Injectable, Logger } from '@nestjs/common';
import { WebhookHandler } from './webhook-handler.interface';

@Injectable()
export class WebhookHandlerRegistry {
  private readonly logger = new Logger(WebhookHandlerRegistry.name);
  private readonly handlerMap = new Map<string, WebhookHandler>();

  /**
   * 注册一个 handler，将其 supportedEvents 逐一映射到该 handler
   */
  register(handler: WebhookHandler): void {
    for (const eventType of handler.supportedEvents) {
      if (this.handlerMap.has(eventType)) {
        this.logger.warn(`Overwriting handler for eventType "${eventType}" — already registered`);
      }
      this.handlerMap.set(eventType, handler);
    }
  }

  /**
   * 根据 eventType 获取对应 handler，找不到返回 null
   */
  getHandler(eventType: string): WebhookHandler | null {
    return this.handlerMap.get(eventType) ?? null;
  }
}
