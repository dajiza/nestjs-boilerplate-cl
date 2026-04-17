import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { AvailabilityService, StaffAvailability } from './availability.service';
import { AvailableDatesQueryDto, AvailableTimesQueryDto, AvailableStaffQueryDto } from './dto/availability-query.dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Availability')
@Controller({
  path: 'availability',
  version: '1',
})
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('dates')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '可预约日期列表', type: [String] })
  getAvailableDates(@Query() query: AvailableDatesQueryDto): Promise<string[]> {
    return this.availabilityService.getAvailableDates(
      query.locationId,
      query.serviceId,
      query.staffId,
      query.searchRangeLower,
      query.searchRangeUpper,
    );
  }

  @Get('times')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '指定日期的可用时段', type: [Object] })
  getAvailableTimes(@Query() query: AvailableTimesQueryDto): Promise<StaffAvailability[]> {
    return this.availabilityService.getAvailableTimes(query.locationId, query.serviceId, query.date, query.staffId);
  }

  @Get('staff')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: '指定时段的可用员工', type: [Object] })
  getAvailableStaff(@Query() query: AvailableStaffQueryDto): Promise<Array<{ staffId: string; staffName: string }>> {
    return this.availabilityService.getAvailableStaff(query.locationId, query.serviceId, query.startAt, query.durationMinutes);
  }
}
