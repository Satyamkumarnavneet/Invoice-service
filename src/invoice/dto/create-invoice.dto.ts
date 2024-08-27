export class CreateInvoiceDto {
    readonly customer: string;
    readonly amount: number;
    readonly reference: string;
    readonly date: Date;
    readonly items: { sku: string; qt: number }[];
  }
  