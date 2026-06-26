import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Invoice, InvoiceStatus } from '@/types/invoice';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatMonth, formatDate, daysUntil } from '@/utils/formatDate';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface InvoiceCardProps {
  invoice: Invoice;
  onPress: () => void;
}

const STATUS_BORDER: Record<InvoiceStatus, string> = {
  paid: colors.primary,
  pending: colors.orange,
  overdue: colors.error,
  upcoming: colors.orange,
};

function getDueText(invoice: Invoice): string {
  if (invoice.status === 'paid') {
    return `Venceu em ${formatDate(invoice.dueDate)}`;
  }
  const days = daysUntil(invoice.dueDate);
  if (days > 1) return `Vence em ${days} dias`;
  if (days === 1) return 'Vence amanhã';
  if (days === 0) return 'Vence hoje';
  if (days === -1) return 'Venceu ontem';
  return `Venceu há ${Math.abs(days)} dias`;
}

function getDueColor(invoice: Invoice): string {
  if (invoice.status === 'paid') return colors.textMuted;
  if (invoice.status === 'overdue') return colors.error;
  const days = daysUntil(invoice.dueDate);
  if (days <= 5) return colors.orange;
  return colors.textMuted;
}

export function InvoiceCard({ invoice, onPress }: InvoiceCardProps) {
  const isOverdue = invoice.status === 'overdue';

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: STATUS_BORDER[invoice.status] }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.row}>
        <View style={[styles.iconWrap, isOverdue && styles.iconWrapOverdue]}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={isOverdue ? colors.error : colors.primary}
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.unit} numberOfLines={1}>
            {invoice.unitName}
          </Text>
          <Text style={styles.month}>{formatMonth(invoice.referenceMonth)}</Text>
          <Text style={[styles.due, { color: getDueColor(invoice) }]}>
            {getDueText(invoice)}
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={[styles.amount, isOverdue && styles.amountOverdue]}>
            {formatCurrency(invoice.amount)}
          </Text>
          <InvoiceStatusBadge status={invoice.status} />
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.border} style={styles.arrow} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    borderLeftWidth: 4,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconWrapOverdue: {
    backgroundColor: colors.errorBg,
  },
  info: { flex: 1 },
  unit: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textDark,
  },
  month: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  due: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  amountOverdue: {
    color: colors.error,
  },
  arrow: { marginLeft: 4 },
});
