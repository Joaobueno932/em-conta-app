import { Payment } from '@/types/payment';

const mockPixCode =
  '00020126580014BR.GOV.BCB.PIX0136em-conta-pix-key@emconta.com.br5204000053039865802BR5925Em Conta Energia Renovavel6009SAO PAULO62070503***6304';

export const paymentService = {
  async getPixCode(invoiceId: string): Promise<Payment> {
    await new Promise((res) => setTimeout(res, 1000));
    return {
      id: `pay_${invoiceId}`,
      invoiceId,
      amount: 187.5,
      method: 'pix',
      status: 'pending',
      pixCode: mockPixCode,
      pixQrCodeUrl: undefined,
    };
  },
};
