import { Invoice } from '@/types/invoice';
import { daysUntil } from '@/utils/formatDate';

const PRIORITY: Record<string, number> = {
  overdue: 0,
  upcoming: 1,
  pending: 2,
};

export function getPendingChargesFromInvoices(invoices: Invoice[]): Invoice[] {
  return invoices
    .filter((inv) => inv.status !== 'paid')
    .sort((a, b) => (PRIORITY[a.status] ?? 3) - (PRIORITY[b.status] ?? 3));
}

export function getChargeTitle(invoice: Invoice): string {
  if (invoice.status === 'overdue') return 'Fatura vencida';
  if (invoice.status === 'upcoming') return 'Vencimento próximo';
  return 'Fatura em aberto';
}

export function getChargeMessage(invoice: Invoice): string {
  if (invoice.status === 'overdue') {
    const days = Math.abs(daysUntil(invoice.dueDate));
    if (days === 0) return 'Esta fatura venceu hoje.';
    if (days === 1) return 'Esta fatura venceu ontem.';
    return `Esta fatura está vencida há ${days} dias.`;
  }
  if (invoice.status === 'upcoming') {
    const days = daysUntil(invoice.dueDate);
    if (days === 0) return 'Esta fatura vence hoje.';
    if (days === 1) return 'Esta fatura vence amanhã.';
    return `Esta fatura vence em ${days} dias.`;
  }
  return 'Esta fatura está em aberto.';
}
