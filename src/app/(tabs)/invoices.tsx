import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Invoice } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';
import { getPendingChargesFromInvoices } from '@/utils/charges';
import { InvoiceCard } from '@/components/invoices/InvoiceCard';
import { PendingChargeCard } from '@/components/invoices/PendingChargeCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoiceService.getAll()
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, []);

  const pendingCharges = getPendingChargesFromInvoices(invoices);
  const chargeCount = pendingCharges.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Faturas</Text>
        <Text style={styles.headerSub}>Acompanhe seus pagamentos e vencimentos</Text>
      </View>

      {loading ? (
        <Loading message="Carregando faturas..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Cobranças pendentes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cobranças pendentes</Text>

            {chargeCount === 0 ? (
              <View style={styles.noPending}>
                <View style={styles.noPendingIcon}>
                  <Ionicons name="checkmark-circle" size={28} color={colors.primary} />
                </View>
                <View style={styles.noPendingText}>
                  <Text style={styles.noPendingTitle}>Nenhuma cobrança pendente</Text>
                  <Text style={styles.noPendingSub}>
                    Você não tem faturas em aberto no momento.
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <Text style={styles.sectionSub}>
                  {chargeCount === 1
                    ? 'Você tem 1 fatura que precisa de atenção.'
                    : `Você tem ${chargeCount} faturas que precisam de atenção.`}
                </Text>
                {pendingCharges.map((invoice) => (
                  <PendingChargeCard
                    key={invoice.id}
                    invoice={invoice}
                    onPress={() => router.push(`/invoice/${invoice.id}` as any)}
                  />
                ))}
              </>
            )}
          </View>

          {/* Todas as faturas */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todas as faturas</Text>

            {invoices.length === 0 ? (
              <EmptyState
                icon="document-outline"
                title="Nenhuma fatura encontrada"
                subtitle="Quando houver faturas disponíveis, elas aparecerão aqui."
              />
            ) : (
              invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onPress={() => router.push(`/invoice/${invoice.id}` as any)}
                />
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.textDark,
  },
  headerSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
    marginTop: 2,
  },
  content: {
    padding: spacing.base,
    gap: spacing.xl,
    paddingBottom: 40,
  },

  // Sections
  section: { gap: spacing.md },
  sectionTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  sectionSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
    marginTop: -spacing.xs,
  },

  // No pending state
  noPending: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noPendingIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  noPendingText: { flex: 1 },
  noPendingTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.primaryDark,
  },
  noPendingSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
    lineHeight: 18,
  },
});
