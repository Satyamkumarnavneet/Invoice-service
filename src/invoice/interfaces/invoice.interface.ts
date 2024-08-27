import { Document } from 'mongoose';

export interface Invoice extends Document {
  readonly customer: string;
  readonly amount: number;
  readonly reference: string;
  readonly date: Date;
  readonly items: { sku: string; qt: number }[];
}
