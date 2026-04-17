import { Controller, Get, Post, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BoulevardService } from './boulevard.service';

@ApiBearerAuth()
@ApiTags('Boulevard')
@Controller({
  path: 'boulevard',
  version: '1',
})
export class BoulevardController {
  constructor(private readonly boulevardService: BoulevardService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  async healthCheck(): Promise<{ status: boolean }> {
    const isHealthy = await this.boulevardService.healthCheck();
    return { status: isHealthy };
  }

  @Get('staff')
  @HttpCode(HttpStatus.OK)
  async listStaff() {
    return this.boulevardService.listStaff();
  }

  @Get('appointments')
  @HttpCode(HttpStatus.OK)
  async listAppointments(
    @Query('staffId') staffId?: string,
    @Query('locationId') locationId?: string,
    @Query('startAt') startAt?: string,
    @Query('endAt') endAt?: string,
    @Query('first') first?: number,
    @Query('after') after?: string,
  ) {
    return this.boulevardService.listAppointments({
      staffId,
      locationId,
      startAt: startAt ? new Date(startAt) : undefined,
      endAt: endAt ? new Date(endAt) : undefined,
      first,
      after,
    });
  }

  @Get('appointments/:id')
  @HttpCode(HttpStatus.OK)
  async getAppointment(@Param('id') id: string) {
    return this.boulevardService.getAppointment(id);
  }

  @Post('appointments')
  @HttpCode(HttpStatus.CREATED)
  async createAppointment(
    @Body()
    input: {
      staffId: string;
      startAt: string;
      duration?: number;
      clientId?: string;
      notes?: string;
      locationId?: string;
    },
  ) {
    return this.boulevardService.createAppointment({
      ...input,
      startAt: new Date(input.startAt),
    });
  }
}
