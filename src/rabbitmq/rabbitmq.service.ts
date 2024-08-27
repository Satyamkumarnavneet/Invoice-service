import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class RabbitMQService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishToQueue(queue: string, message: any) {
    await this.amqpConnection.publish('', queue, message);
  }
}
