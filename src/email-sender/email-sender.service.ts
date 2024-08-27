import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailSenderService {
  async sendSalesReportEmail(report: any) {
    // Mock implementation of email sending
    console.log('Sending email with report:', report);
  }
}
