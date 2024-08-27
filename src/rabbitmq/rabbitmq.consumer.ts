import { Injectable } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EmailSenderService } from '../email-sender/email-sender.service';

@Injectable()
export class RabbitMQConsumer {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  @RabbitSubscribe({
    exchange: '',
    routingKey: 'daily_sales_report',
    queue: 'daily_sales_report',
  })
  async handleSalesReport(message: any) {
    await this.emailSenderService.sendSalesReportEmail(message);
  }
}
