import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './interfaces/invoice.interface';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel('Invoice') private readonly invoiceModel: Model<Invoice>) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findById(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(id).exec();
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Invoice[]> {
    return this.invoiceModel.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).exec();
  }
}
