import { PixPayment } from '@/types/payment';
import { mockInvoices } from '@/mocks/invoices.mock';

const BASE_PIX =
  '00020126580014BR.GOV.BCB.PIX0136em-conta-pix-key@emconta.com.br' +
  '5204000053039865802BR5925Em Conta Energia Renovavel6009SAO PAULO';

export const paymentService = {
  async getPixByInvoiceId(invoiceId: string): Promise<PixPayment> {
    await new Promise((res) => setTimeout(res, 900));

    const invoice = mockInvoices.find((i) => i.id === invoiceId);

    if (!invoice) {
      return { invoiceId, status: 'unavailable', pixCode: null, qrCodeImage: null, expiresAt: null };
    }

    if (invoice.status === 'paid') {
      return { invoiceId, status: 'paid', pixCode: null, qrCodeImage: null, expiresAt: null };
    }

    return {
      invoiceId,
      status: 'available',
      pixCode: `${BASE_PIX}62090510${invoiceId.toUpperCase()}6304`,
      qrCodeImage: null,
      expiresAt: `${invoice.dueDate}T23:59:59`,
    };
  },
};
