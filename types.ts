export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone?: string;
  logoUrl?: string;

  // Client Info
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone?: string;

  // Invoice Details
  invoiceNumber: string;
  invoiceDate: string;
  dueDate?: string;
  currency: string;
  paymentMethod?: string;

  // Items
  items: LineItem[];
}