import { Notice } from '@/types/notice';
import { Invoice } from '@/types/invoice';
import { mockNotices } from '@/mocks/notices.mock';
import { mockInvoices } from '@/mocks/invoices.mock';
import { getDueSoonInvoices, getDueSoonMessage } from '@/utils/dueSoon';

const DUE_PREFIX = 'due-';

/** Constrói um aviso de "vencimento próximo" derivado de uma fatura. */
function toDueSoonNotice(invoice: Invoice): Notice {
  return {
    id: `${DUE_PREFIX}${invoice.id}`,
    unitId: invoice.unitId,
    title: 'Vencimento próximo',
    message: getDueSoonMessage(invoice),
    type: 'due_soon',
    createdAt: `${invoice.dueDate}T00:00:00`,
    read: false,
    invoiceId: invoice.id,
  };
}

export const noticeService = {
  async getAll(): Promise<Notice[]> {
    await new Promise((res) => setTimeout(res, 600));
    return mockNotices;
  },

  async getById(id: string): Promise<Notice> {
    await new Promise((res) => setTimeout(res, 300));

    if (id.startsWith(DUE_PREFIX)) {
      const invoiceId = id.slice(DUE_PREFIX.length);
      const invoice = mockInvoices.find((i) => i.id === invoiceId);
      if (!invoice) throw new Error('Aviso não encontrado.');
      return toDueSoonNotice(invoice);
    }

    const notice = mockNotices.find((n) => n.id === id);
    if (!notice) throw new Error('Aviso não encontrado.');
    return notice;
  },

  async getByUnitId(unitId: string): Promise<Notice[]> {
    await new Promise((res) => setTimeout(res, 400));
    return mockNotices.filter((n) => n.unitId === unitId);
  },

  /**
   * Lista combinada da central de avisos: avisos de vencimento próximo derivados
   * das faturas + avisos mockados (cobrança, recado, manutenção, comunicado).
   * Quando `unitId` é informado, considera apenas a unidade. Os derivados aparecem no topo.
   */
  async getByUnitIdWithDerivedDueSoon(unitId?: string): Promise<Notice[]> {
    await new Promise((res) => setTimeout(res, 500));

    const invoices = unitId
      ? mockInvoices.filter((i) => i.unitId === unitId)
      : mockInvoices;
    const derived = getDueSoonInvoices(invoices).map(toDueSoonNotice);

    const mocked = unitId
      ? mockNotices.filter((n) => n.unitId === unitId)
      : mockNotices;

    return [...derived, ...mocked];
  },

  async markAsRead(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));
    const notice = mockNotices.find((n) => n.id === id);
    if (notice) notice.read = true;
  },
};
