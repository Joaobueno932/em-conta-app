import { Invoice } from '@/types/invoice';
import { daysUntil } from '@/utils/formatDate';

/** Janela (em dias) considerada "vencimento próximo". */
export const DUE_SOON_DAYS = 5;

/**
 * Uma fatura é "vencimento próximo" quando:
 * - não está paga;
 * - não está vencida;
 * - está com status `upcoming`, ou vence entre hoje e os próximos DUE_SOON_DAYS dias.
 */
export function isInvoiceDueSoon(invoice: Invoice): boolean {
  if (invoice.status === 'paid' || invoice.status === 'overdue') return false;
  if (invoice.status === 'upcoming') return true;
  const days = daysUntil(invoice.dueDate);
  return days >= 0 && days <= DUE_SOON_DAYS;
}

/** Faturas com vencimento próximo, ordenadas da mais urgente para a menos urgente. */
export function getDueSoonInvoices(invoices: Invoice[]): Invoice[] {
  return invoices
    .filter(isInvoiceDueSoon)
    .sort((a, b) => daysUntil(a.dueDate) - daysUntil(b.dueDate));
}

/** A fatura com vencimento mais próximo, se houver. */
export function getNextDueSoonInvoice(invoices: Invoice[]): Invoice | null {
  return getDueSoonInvoices(invoices)[0] ?? null;
}

/** Texto simples e didático sobre o vencimento. Ex.: "Sua fatura vence em 4 dias." */
export function getDueSoonMessage(invoice: Invoice): string {
  const days = daysUntil(invoice.dueDate);
  if (days <= 0) return 'Sua fatura vence hoje.';
  if (days === 1) return 'Sua fatura vence amanhã.';
  return `Sua fatura vence em ${days} dias.`;
}
