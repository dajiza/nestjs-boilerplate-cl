import { NullableType } from '../../../utils/types/nullable.type';
import { WebhookEvent } from '../../domain/webhook-event';

export abstract class WebhookEventRepository {
  abstract create(data: WebhookEvent): Promise<WebhookEvent>;

  abstract findById(id: string): Promise<NullableType<WebhookEvent>>;

  abstract findManyWithPagination(params: {
    eventType?: string;
    resource?: string;
    processed?: boolean;
    page: number;
    limit: number;
  }): Promise<{ data: WebhookEvent[]; total: number }>;
}
