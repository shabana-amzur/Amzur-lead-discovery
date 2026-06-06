import { Injectable } from '@nestjs/common';

@Injectable()
export class ContactsService {
  async findByLead(leadId: string) {
    // Mock contacts
    return [
      {
        id: '1',
        leadId,
        name: 'John Smith',
        title: 'CTO',
        email: 'john.smith@techcorp.com',
        linkedinUrl: 'https://linkedin.com/in/johnsmith',
      },
      {
        id: '2',
        leadId,
        name: 'Sarah Johnson',
        title: 'VP Engineering',
        email: 'sarah.johnson@techcorp.com',
        linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
      },
    ];
  }
}
