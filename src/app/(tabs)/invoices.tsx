import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Invoice } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';
import { InvoiceCard } from '@/components/invoices/InvoiceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    invoiceService.getAll()
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, []);

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
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
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
  list: {
    padding: spacing.base,
    gap: spacing.md,
    paddingBottom: 40,
  },
});
