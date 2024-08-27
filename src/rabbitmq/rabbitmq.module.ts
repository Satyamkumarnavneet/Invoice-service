import { Module } from '@nestjs/common';
import { RabbitMQModule as NestRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumer } from './rabbitmq.consumer';
import { EmailSenderModule } from '../email-sender/email-sender.module';

@Module({
  imports: [
    NestRabbitMQModule.forRoot(NestRabbitMQModule, {
      exchanges: [
        {
          name: 'daily_sales_report',
          type: 'direct',
        },
      ],
      uri: 'amqp://guest:guest@localhost:5672',
      connectionInitOptions: { wait: false },
    }),
    EmailSenderModule,
  ],
  providers: [RabbitMQService, RabbitMQConsumer],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
