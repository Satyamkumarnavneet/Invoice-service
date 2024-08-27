import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InvoiceService } from '../invoice/invoice.service';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async handleDailySalesReport() {
    this.logger.log('Starting daily sales report generation...');
    const report = await this.generateDailySalesReport();
    this.logger.log('Daily sales report generated:', report);

    await this.rabbitMQService.publishToQueue('daily_sales_report', report);
    this.logger.log('Daily sales report published to RabbitMQ');
  }

  async generateDailySalesReport() {
    const today = new Date();
    const startDate = new Date(today.setHours(0, 0, 0, 0));
    const endDate = new Date(today.setHours(23, 59, 59, 999));

    const invoices = await this.invoiceService.findByDateRange(startDate, endDate);

    let totalSalesAmount = 0;
    const itemSummary = {};

    invoices.forEach((invoice) => {
      totalSalesAmount += invoice.amount;
      invoice.items.forEach((item) => {
        if (!itemSummary[item.sku]) {
          itemSummary[item.sku] = 0;
        }
        itemSummary[item.sku] += item.qt;
      });
    });

    return {
      totalSalesAmount,
      itemSummary,
    };
  }
}
