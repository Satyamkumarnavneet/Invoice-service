import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from '../../src/invoice/invoice.controller';
import { InvoiceService } from '../../src/invoice/invoice.service';
import { CreateInvoiceDto } from '../../src/invoice/dto/create-invoice.dto';
import { Invoice } from '../../src/invoice/interfaces/invoice.interface';
import { getModelToken } from '@nestjs/mongoose';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('InvoiceController', () => {
  let app: INestApplication;
  let invoiceService: InvoiceService;

  const mockInvoiceService = {
    create: jest.fn((dto: CreateInvoiceDto) => ({
      ...dto,
      _id: 'someId',
    })),
    findById: jest.fn((id: string) => ({
      _id: id,
      customer: 'John Doe',
      amount: 100,
      reference: 'INV001',
      date: new Date(),
      items: [
        { sku: 'item001', qt: 2 },
      ],
    })),
    findAll: jest.fn(() => [
      {
        _id: 'someId',
        customer: 'John Doe',
        amount: 100,
        reference: 'INV001',
        date: new Date(),
        items: [{ sku: 'item001', qt: 2 }],
      },
    ]),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        InvoiceService,
        {
          provide: getModelToken('Invoice'),
          useValue: mockInvoiceService,
        },
      ],
    })
      .overrideProvider(InvoiceService)
      .useValue(mockInvoiceService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    invoiceService = moduleFixture.get<InvoiceService>(InvoiceService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an invoice', async () => {
    const createInvoiceDto: CreateInvoiceDto = {
      customer: 'John Doe',
      amount: 100,
      reference: 'INV001',
      date: new Date(),
      items: [
        { sku: 'item001', qt: 2 },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/invoices')
      .send(createInvoiceDto)
      .expect(201);

    expect(response.body).toEqual({
      ...createInvoiceDto,
      _id: expect.any(String),
    });
    expect(invoiceService.create).toHaveBeenCalledWith(createInvoiceDto);
  });

  it('should retrieve an invoice by ID', async () => {
    const invoiceId = 'someId';
    const response = await request(app.getHttpServer())
      .get(`/invoices/${invoiceId}`)
      .expect(200);

    expect(response.body).toEqual({
      _id: invoiceId,
      customer: 'John Doe',
      amount: 100,
      reference: 'INV001',
      date: expect.any(String),
      items: [
        { sku: 'item001', qt: 2 },
      ],
    });
    expect(invoiceService.findById).toHaveBeenCalledWith(invoiceId);
  });

  it('should retrieve all invoices', async () => {
    const response = await request(app.getHttpServer())
      .get('/invoices')
      .expect(200);

    expect(response.body).toEqual([
      {
        _id: 'someId',
        customer: 'John Doe',
        amount: 100,
        reference: 'INV001',
        date: expect.any(String),
        items: [
          { sku: 'item001', qt: 2 },
        ],
      },
    ]);
    expect(invoiceService.findAll).toHaveBeenCalled();
  });

  it('should handle not found for invoice by ID', async () => {
    jest.spyOn(invoiceService, 'findById').mockResolvedValueOnce(null);

    const response = await request(app.getHttpServer())
      .get('/invoices/nonexistentId')
      .expect(404);

    expect(response.body).toEqual({ message: 'Invoice not found' });
  });

  it('should handle errors during invoice creation', async () => {
    jest.spyOn(invoiceService, 'create').mockRejectedValue(new Error('Creation failed'));

    const createInvoiceDto: CreateInvoiceDto = {
      customer: 'John Doe',
      amount: 100,
      reference: 'INV001',
      date: new Date(),
      items: [
        { sku: 'item001', qt: 2 },
      ],
    };

    await request(app.getHttpServer())
      .post('/invoices')
      .send(createInvoiceDto)
      .expect(500);
  });
});
