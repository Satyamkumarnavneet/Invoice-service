import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { InvoiceModule } from '../invoice/invoice.module'; // Import the module that provides InvoiceService
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';

@Module({
  imports: [InvoiceModule, RabbitMQModule], // Ensure InvoiceModule is imported here
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
