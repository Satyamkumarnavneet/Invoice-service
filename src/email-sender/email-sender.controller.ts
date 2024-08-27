import { Controller, Get } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';

@Controller('email-sender')
export class EmailSenderController {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  @Get('test')
  async testEmailSending() {
    // Mock data for testing
    const report = {
      totalSalesAmount: 5000,
      itemSummary: {
        item1: 20,
        item2: 15,
      },
    };
    await this.emailSenderService.sendSalesReportEmail(report);
    return { message: 'Test email sent successfully' };
  }
}
