export type PixStatus = 'available' | 'unavailable' | 'paid';

export interface PixPayment {
  invoiceId: string;
  status: PixStatus;
  pixCode: string | null;
  qrCodeImage: string | null;
  expiresAt: string | null;
}
