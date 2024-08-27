import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQService } from '../../src/rabbitmq/rabbitmq.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

describe('RabbitMQService', () => {
  let service: RabbitMQService;
  let amqpConnection: AmqpConnection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RabbitMQService,
        {
          provide: AmqpConnection,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RabbitMQService>(RabbitMQService);
    amqpConnection = module.get<AmqpConnection>(AmqpConnection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('publishToQueue', () => {
    it('should publish a message to a RabbitMQ queue', async () => {
      const queue = 'test_queue';
      const message = { content: 'test message' };
      jest.spyOn(amqpConnection, 'publish').mockResolvedValue(undefined);

      await service.publishToQueue(queue, message);

      expect(amqpConnection.publish).toHaveBeenCalledWith('', queue, message);
    });

    it('should handle errors during message publishing', async () => {
      const queue = 'test_queue';
      const message = { content: 'test message' };
      jest.spyOn(amqpConnection, 'publish').mockRejectedValue(new Error('Publishing failed'));

      await expect(service.publishToQueue(queue, message)).rejects.toThrow('Publishing failed');
    });
  });
});
