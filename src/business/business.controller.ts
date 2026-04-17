import { Controller, Get, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { NullableType } from '../utils/types/nullable.type';
import { Business } from './domain/business';
import { BusinessService } from './business.service';
import { RolesGuard } from '../roles/roles.guard';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Business')
@Controller({
  path: 'business',
  version: '1',
})
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @ApiOkResponse({
    type: Business,
  })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<{ data: Business[]; total: number }> {
    const data = await this.businessService.findAll();
    return { data, total: data.length };
  }

  @ApiOkResponse({
    type: Business,
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  findOne(@Param('id') id: Business['id']): Promise<NullableType<Business>> {
    return this.businessService.findById(id);
  }
}
