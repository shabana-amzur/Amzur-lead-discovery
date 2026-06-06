import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LeadsService } from './leads.service';
import { CreateLeadDto, UpdateLeadDto, LeadFilterDto } from './dto';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  create(@Body() createLeadDto: CreateLeadDto) {
    return this.leadsService.create(createLeadDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads with optional filters' })
  findAll(@Query() filters: LeadFilterDto) {
    return this.leadsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by ID' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update lead' })
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadsService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lead' })
  remove(@Param('id') id: string) {
    return this.leadsService.remove(id);
  }

  @Post('discover')
  @ApiOperation({ summary: 'Trigger lead discovery job' })
  discover() {
    return this.leadsService.triggerDiscovery();
  }

  @Post(':id/qualify')
  @ApiOperation({ summary: 'Qualify lead and calculate score' })
  qualify(@Param('id') id: string) {
    return this.leadsService.qualify(id);
  }

  @Post(':id/enrich')
  @ApiOperation({ summary: 'Enrich lead data' })
  enrich(@Param('id') id: string) {
    return this.leadsService.enrich(id);
  }
}
