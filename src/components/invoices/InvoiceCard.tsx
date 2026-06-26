import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Invoice } from '@/types/invoice';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatMonth, formatDate } from '@/utils/formatDate';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface InvoiceCardProps {
  invoice: Invoice;
  onPress: () => void;
}

export function InvoiceCard({ invoice, onPress }: InvoiceCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="document-text-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.unit} numberOfLines={1}>{invoice.unitName}</Text>
          <Text style={styles.month}>{formatMonth(invoice.referenceMonth)}</Text>
          <Text style={styles.due}>Vence: {formatDate(invoice.dueDate)}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>{formatCurrency(invoice.amount)}</Text>
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
    color: colors.textMuted,
    marginTop: 2,
  },
  right: { alignItems: 'flex-end', gap: 4 },
  amount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  arrow: { marginLeft: 4 },
});
