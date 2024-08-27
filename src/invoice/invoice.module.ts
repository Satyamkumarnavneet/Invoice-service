import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller'; // Import the InvoiceController
import { InvoiceSchema } from './schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Invoice', schema: InvoiceSchema }]),
  ],
  providers: [InvoiceService],
  controllers: [InvoiceController], // Ensure InvoiceController is included here
  exports: [InvoiceService], 
})
export class InvoiceModule {}
