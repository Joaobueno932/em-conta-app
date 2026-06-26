import { InvoiceStatus } from '@/types/invoice';
import { colors } from '@/constants/colors';

export function getStatusLabel(status: InvoiceStatus): string {
  const labels: Record<InvoiceStatus, string> = {
    paid: 'Pago',
    pending: 'Pendente',
    overdue: 'Vencida',
    upcoming: 'A vencer',
  };
  return labels[status];
}

export function getStatusColor(status: InvoiceStatus): string {
  const statusColors: Record<InvoiceStatus, string> = {
    paid: colors.success,
    pending: colors.orange,
    overdue: colors.error,
    upcoming: colors.primaryDark,
  };
  return statusColors[status];
}

export function getStatusBg(status: InvoiceStatus): string {
  const bgColors: Record<InvoiceStatus, string> = {
    paid: colors.successBg,
    pending: colors.warningBg,
    overdue: colors.errorBg,
    upcoming: colors.greenBg,
  };
  return bgColors[status];
}
