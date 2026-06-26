import { Invoice, InvoiceStatus } from '@/types/invoice';
import { colors } from '@/constants/colors';
import { daysUntil } from '@/utils/formatDate';

export function getStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    paid: 'Paga',
    pending: 'Em aberto',
    overdue: 'Vencida',
    upcoming: 'Próxima do vencimento',
  };
  return labels[status];
}

export function getStatusColor(status: InvoiceStatus): string {
  const statusColors: Record<InvoiceStatus, string> = {
    paid: colors.success,
    pending: colors.orange,
    overdue: colors.error,
    upcoming: colors.orangeDark,
  };
  return statusColors[status];
}

export function getStatusBg(status: InvoiceStatus): string {
  const bgColors: Record<InvoiceStatus, string> = {
    paid: colors.successBg,
    pending: colors.warningBg,
    overdue: colors.errorBg,
    upcoming: colors.orangeBg,
  };
  return bgColors[status];
}

export function isDueSoon(invoice: Invoice): boolean {
  if (invoice.status === 'paid' || invoice.status === 'overdue') return false;
  const days = daysUntil(invoice.dueDate);
  return days >= 0 && days <= 5;
}
