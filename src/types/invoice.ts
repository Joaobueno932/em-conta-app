export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'upcoming';

export interface Invoice {
  id: string;
  unitId: string;
  unitName: string;
  referenceMonth: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  consumption: number;
  savings: number;
  pdfUrl?: string;
}
