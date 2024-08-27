import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../src/invoice/interfaces/invoice.interface';
import { TasksService } from '../../src/tasks/tasks.service';
import { RabbitMQService } from '../../src/rabbitmq/rabbitmq.service';

describe('TasksService', () => {
  let service: TasksService;
  let invoiceModel: Model<Invoice>;
  let rabbitMQService: RabbitMQService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getModelToken('Invoice'),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: RabbitMQService,
          useValue: {
            publishToQueue: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    invoiceModel = module.get<Model<Invoice>>(getModelToken('Invoice'));
    rabbitMQService = module.get<RabbitMQService>(RabbitMQService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate a daily sales report and publish to RabbitMQ', async () => {
    const invoices: Invoice[] = [
      new invoiceModel({
        customer: 'John Doe',
        amount: 100,
        reference: 'INV001',
        date: new Date('2024-08-27'),
        items: [{ sku: 'item1', qt: 2 }],
      }),
      new invoiceModel({
        customer: 'Jane Doe',
        amount: 200,
        reference: 'INV002',
        date: new Date('2024-08-27'),
        items: [{ sku: 'item1', qt: 1 }],
      }),
    ];

    jest.spyOn(invoiceModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(invoices),
    } as any);

    const publishSpy = jest.spyOn(rabbitMQService, 'publishToQueue');

    await service.generateDailySalesReport();

    expect(publishSpy).toHaveBeenCalledWith('daily_sales_report', expect.anything());
  });

  it('should handle errors during daily sales report generation', async () => {
    jest.spyOn(invoiceModel, 'find').mockRejectedValue(new Error('Database error'));

    await expect(service.generateDailySalesReport()).rejects.toThrow('Database error');
  });
});
