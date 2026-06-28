import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Invoice } from '@/types/invoice';
import { invoiceService } from '@/services/invoiceService';
import { useUnitStore } from '@/stores/unitStore';
import { getDueSoonInvoices, getDueSoonMessage } from '@/utils/dueSoon';
import { formatDate } from '@/utils/formatDate';
import { NoticeCard } from '@/components/notices/NoticeCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing } from '@/constants/spacing';

export default function NoticesScreen() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedUnit = useUnitStore((s) => s.selectedUnit);

  useEffect(() => {
    invoiceService.getAll()
      .then(setInvoices)
      .finally(() => setLoading(false));
  }, []);

  const unitInvoices = selectedUnit
    ? invoices.filter((inv) => inv.unitId === selectedUnit.id)
    : invoices;
  const dueSoon = getDueSoonInvoices(unitInvoices);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
        <Text style={styles.headerSub}>Fique por dentro dos seus vencimentos</Text>
      </View>

      {loading ? (
        <Loading message="Carregando avisos..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {dueSoon.length === 0 ? (
            <EmptyState
              icon="notifications-outline"
              title="Nenhum aviso por enquanto"
              subtitle="Quando uma fatura estiver perto do vencimento, o aviso aparecerá aqui."
            />
          ) : (
            dueSoon.map((invoice) => (
              <NoticeCard
                key={invoice.id}
                title="Vencimento próximo"
                message={getDueSoonMessage(invoice)}
                date={`Vencimento em ${formatDate(invoice.dueDate)}`}
                unitName={invoice.unitName}
                variant="warning"
                highlighted
                actionLabel="Ver fatura"
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
  content: {
    padding: spacing.base,
    gap: spacing.md,
    paddingBottom: 40,
  },
});
