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
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, formatMonth } from '@/utils/formatDate';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    invoiceService.getById(id).then(setInvoice).catch(() => {
      setError('Não foi possível carregar a fatura.');
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (error || !invoice) return <ErrorMessage message={error || 'Fatura não encontrada.'} onRetry={() => router.back()} />;

  const canPay = invoice.status === 'pending' || invoice.status === 'overdue';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhe da Fatura</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status card */}
        <Card style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.month}>{formatMonth(invoice.referenceMonth)}</Text>
              <Text style={styles.unitName}>{invoice.unitName}</Text>
            </View>
            <InvoiceStatusBadge status={invoice.status} />
          </View>
          <Text style={styles.amount}>{formatCurrency(invoice.amount)}</Text>
          <Text style={styles.due}>Vence em {formatDate(invoice.dueDate)}</Text>
        </Card>

        {/* Detalhes */}
        <Card style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Detalhes</Text>

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
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Vencimento</Text>
            <Text style={styles.rowValue}>{formatDate(invoice.dueDate)}</Text>
          </View>
          <View style={styles.separator} />
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Referência</Text>
            <Text style={styles.rowValue}>{formatMonth(invoice.referenceMonth)}</Text>
          </View>
        </Card>

        {canPay && (
          <Button
            label="Pagar com Pix"
            onPress={() => router.push(`/invoice/payment?invoiceId=${invoice.id}&amount=${invoice.amount}`)}
            style={styles.payBtn}
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
  statusCard: {},
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
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
  due: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
    marginTop: 4,
  },
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
  payBtn: { width: '100%', marginTop: spacing.sm },
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
