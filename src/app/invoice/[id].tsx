import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Invoice } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';
import { InvoiceStatusBadge } from '@/components/invoices/InvoiceStatusBadge';
import { Loading } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, formatMonth, daysUntil } from '@/utils/formatDate';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

function getDueText(invoice: Invoice): string {
  if (invoice.status === 'paid') return `Pago em ${formatDate(invoice.dueDate)}`;
  const days = daysUntil(invoice.dueDate);
  if (days > 1) return `Vence em ${days} dias`;
  if (days === 1) return 'Vence amanhã';
  if (days === 0) return 'Vence hoje';
  if (days === -1) return 'Venceu ontem';
  return `Venceu há ${Math.abs(days)} dias`;
}

function getDueColor(invoice: Invoice): string {
  if (invoice.status === 'paid') return colors.textLight;
  if (invoice.status === 'overdue') return colors.error;
  const days = daysUntil(invoice.dueDate);
  if (days <= 5) return colors.orange;
  return colors.textLight;
}

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    invoiceService
      .getById(id)
      .then(setInvoice)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading message="Carregando fatura..." />;

  if (notFound || !invoice) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhe da Fatura</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.notFound}>
          <View style={styles.notFoundIconWrap}>
            <Ionicons name="document-outline" size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.notFoundTitle}>Fatura não encontrada</Text>
          <Text style={styles.notFoundSub}>
            Não conseguimos encontrar essa fatura. Volte para a lista e tente novamente.
          </Text>
          <Button
            label="Voltar para faturas"
            onPress={() => router.replace('/(tabs)/invoices' as any)}
            variant="secondary"
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    );
  }

  const isOverdue = invoice.status === 'overdue';
  const canPay = invoice.status !== 'paid';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe da Fatura</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card style={[styles.statusCard, isOverdue && styles.statusCardOverdue]}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.month}>{formatMonth(invoice.referenceMonth)}</Text>
              <Text style={styles.unitName}>{invoice.unitName}</Text>
            </View>
            <InvoiceStatusBadge status={invoice.status} />
          </View>
          <Text style={[styles.amount, isOverdue && styles.amountOverdue]}>
            {formatCurrency(invoice.amount)}
          </Text>
          <Text style={[styles.due, { color: getDueColor(invoice) }]}>
            {getDueText(invoice)}
          </Text>
        </Card>

        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Detalhes</Text>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Unidade</Text>
            <Text style={styles.rowValue}>{invoice.unitName}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Referência</Text>
            <Text style={styles.rowValue}>{formatMonth(invoice.referenceMonth)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Vencimento</Text>
            <Text style={[styles.rowValue, isOverdue && { color: colors.error }]}>
              {formatDate(invoice.dueDate)}
            </Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Consumo</Text>
            <Text style={styles.rowValue}>{invoice.consumption} kWh</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Economia gerada</Text>
            <Text style={[styles.rowValue, { color: colors.primary }]}>
              {formatCurrency(invoice.savings)}
            </Text>
          </View>
        </Card>

        {canPay && (
          <Button
            label="Pagar agora"
            onPress={() =>
              router.push(
                `/invoice/payment?invoiceId=${invoice.id}&amount=${invoice.amount}` as any,
              )
            }
            style={{ marginTop: spacing.sm }}
          />
        )}

        {invoice.status === 'paid' && (
          <View style={styles.paidBanner}>
            <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
            <Text style={styles.paidText}>Esta fatura já foi paga. Obrigado!</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
    paddingTop: 56,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.white,
  },
  content: { padding: spacing.base, gap: spacing.md, paddingBottom: 40 },

  // Not found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    gap: spacing.md,
  },
  notFoundIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surfaceLight,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  notFoundSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Status card
  statusCard: {},
  statusCardOverdue: {
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  month: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
  },
  unitName: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textDark,
    marginTop: 2,
  },
  amount: {
    fontFamily: fontFamily.black,
    fontSize: 40,
    color: colors.textDark,
    letterSpacing: -1,
  },
  amountOverdue: {
    color: colors.error,
  },
  due: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    marginTop: 4,
  },

  // Details card
  detailsCard: { gap: 0 },
  sectionTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  rowLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
  },
  rowValue: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.textDark,
  },
  separator: { height: 1, backgroundColor: colors.border },

  // Paid banner
  paidBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.successBg,
    borderRadius: radius.xl,
    padding: spacing.base,
    marginTop: spacing.sm,
  },
  paidText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.primaryDark,
    flex: 1,
  },
});
