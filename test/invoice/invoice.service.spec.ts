import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from '../../src/invoice/interfaces/invoice.interface';
import { InvoiceService } from '../../src/invoice/invoice.service';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: Model<Invoice>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken('Invoice'),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken('Invoice'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an invoice', async () => {
    const createInvoiceDto = {
      customer: 'John Doe',
      amount: 100,
      reference: 'INV001',
      date: new Date(),
      items: [{ sku: 'item1', qt: 2 }],
    };

    jest.spyOn(model, 'create').mockResolvedValueOnce(createInvoiceDto as any);
    const result = await service.create(createInvoiceDto);
    expect(result).toEqual(createInvoiceDto);
  });

  it('should return all invoices', async () => {
    const invoices = [mockInvoice];
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(invoices),
    } as any);
    const result = await service.findAll();
    expect(result).toEqual(invoices);
  });

  it('should return an invoice by ID', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(mockInvoice),
    } as any);
    const result = await service.findById('someId');
    expect(result).toEqual(mockInvoice);
  });

  it('should return invoices by date range', async () => {
    const invoices = [mockInvoice];
    jest.spyOn(model, 'find').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(invoices),
    } as any);
    const result = await service.findByDateRange(new Date('2024-08-01'), new Date('2024-08-31'));
    expect(result).toEqual(invoices);
  });

  it('should handle errors during creation', async () => {
    jest.spyOn(model, 'create').mockRejectedValueOnce(new Error('Creation failed'));
    await expect(service.create(mockInvoice)).rejects.toThrow('Creation failed');
  });

  it('should handle not found for invoice by ID', async () => {
    jest.spyOn(model, 'findById').mockReturnValueOnce({
      exec: jest.fn().mockResolvedValueOnce(null),
    } as any);
    const result = await service.findById('nonexistentId');
    expect(result).toBeNull();
  });
});

const mockInvoice = {
  customer: 'John Doe',
  amount: 100,
  reference: 'INV001',
  date: new Date(),
  items: [{ sku: 'item1', qt: 2 }],
};
