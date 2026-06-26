import { Invoice } from '@/types/invoice';
import { mockInvoices } from '@/mocks/invoices.mock';

export const invoiceService = {
  async getAll(): Promise<Invoice[]> {
    await new Promise((res) => setTimeout(res, 800));
    return mockInvoices;
  },

  async getById(id: string): Promise<Invoice> {
    await new Promise((res) => setTimeout(res, 500));
    const invoice = mockInvoices.find((i) => i.id === id);
    if (!invoice) throw new Error('Fatura não encontrada.');
    return invoice;
  },

  async getByUnit(unitId: string): Promise<Invoice[]> {
    await new Promise((res) => setTimeout(res, 600));
    return mockInvoices.filter((i) => i.unitId === unitId);
  },
};
