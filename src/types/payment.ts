export type PaymentMethod = 'pix' | 'boleto' | 'card';
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  paidAt?: string;
  pixCode?: string;
  pixQrCodeUrl?: string;
}
