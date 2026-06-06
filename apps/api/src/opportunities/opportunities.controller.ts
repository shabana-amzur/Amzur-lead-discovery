import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OpportunitiesService } from './opportunities.service';

@ApiTags('opportunities')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all opportunities' })
  findAll(@Query('service') service?: string) {
    return this.opportunitiesService.findAll(service);
  }

  @Get('by-service')
  @ApiOperation({ summary: 'Get opportunities grouped by service' })
  getByService() {
    return this.opportunitiesService.getByService();
  }
}
