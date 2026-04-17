import { Controller, Post, Get, Param, Body, Headers, Query, Logger, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { WebhooksService } from './webhooks.service';
import { QueryWebhookEventDto } from './dto/query-webhook-event.dto';
import { WebhookEvent } from './domain/webhook-event';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';

@ApiTags('Webhooks')
@Controller({
  path: 'webhooks',
  version: '1',
})
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('boulevard')
  @HttpCode(HttpStatus.OK)
  async handleBoulevardWebhook(@Body() body: any, @Headers() headers: any): Promise<{ received: boolean }> {
    try {
      this.logger.log('Received Boulevard webhook:', body?.eventType);

      const isValid = this.webhooksService.validateWebhookSignature(body, headers);

      if (!isValid) {
        this.logger.warn('Invalid webhook signature');
        return { received: false };
      }

      await this.webhooksService.handleWebhookEvent(body);

      return { received: true };
    } catch (error) {
      this.logger.error('Error processing webhook:', error);
      return { received: false };
    }
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('events')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: [WebhookEvent] })
  async getEvents(@Query() query: QueryWebhookEventDto): Promise<{ data: WebhookEvent[]; total: number }> {
    return this.webhooksService.findEvents({
      eventType: query.eventType,
      resource: query.resource,
      processed: query.processed,
      page: query.page ?? 1,
      limit: query.limit ?? 20,
    });
  }

  @ApiBearerAuth()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('events/:id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'id', type: String })
  @ApiOkResponse({ type: WebhookEvent })
  async getEventById(@Param('id') id: string): Promise<WebhookEvent | null> {
    return this.webhooksService.findEventById(id);
  }
}
