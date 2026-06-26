import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Invoice } from '@/types/invoice';
import { formatCurrency } from '@/utils/formatCurrency';
import { getChargeTitle, getChargeMessage } from '@/utils/charges';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface PendingChargeCardProps {
  invoice: Invoice;
  onPress: () => void;
}

function getAccent(invoice: Invoice): { color: string; bg: string; icon: keyof typeof Ionicons.glyphMap } {
  if (invoice.status === 'overdue') {
    return { color: colors.error, bg: colors.errorBg, icon: 'alert-circle' };
  }
  if (invoice.status === 'upcoming') {
    return { color: colors.orange, bg: colors.orangeBg, icon: 'time-outline' };
  }
  return { color: colors.orange, bg: colors.orangeBg, icon: 'document-text-outline' };
}

export function PendingChargeCard({ invoice, onPress }: PendingChargeCardProps) {
  const { color, bg, icon } = getAccent(invoice);

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: color }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.top}>
        <View style={styles.titleRow}>
          <View style={[styles.iconBox, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={18} color={color} />
          </View>
          <Text style={[styles.chargeTitle, { color }]}>{getChargeTitle(invoice)}</Text>
        </View>
        <Text style={[styles.amount, { color: invoice.status === 'overdue' ? colors.error : colors.textDark }]}>
          {formatCurrency(invoice.amount)}
        </Text>
      </View>

      <Text style={styles.unit}>{invoice.unitName}</Text>
      <Text style={[styles.message, { color }]}>{getChargeMessage(invoice)}</Text>

      <View style={styles.divider} />

      <View style={styles.action}>
        <Text style={[styles.actionLabel, { color }]}>Ver fatura</Text>
        <Ionicons name="chevron-forward" size={16} color={color} />
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
    gap: spacing.xs,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chargeTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.base,
  },
  amount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    letterSpacing: -0.5,
  },
  unit: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textDark,
  },
  message: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  actionLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
  },
});
