import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';

@ApiTags('contacts')
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get('lead/:leadId')
  @ApiOperation({ summary: 'Get contacts for a lead' })
  findByLead(@Param('leadId') leadId: string) {
    return this.contactsService.findByLead(leadId);
  }
}
