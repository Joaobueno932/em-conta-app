import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { mockFaturas, Fatura } from '@/mocks/faturas.mock';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

function FaturaCard({ fatura }: { fatura: Fatura }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.month}>{fatura.month}</Text>
        <View style={styles.badge}>
          <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
          <Text style={styles.badgeText}>Processada</Text>
        </View>
      </View>

      <View style={styles.valuesRow}>
        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>Valor da conta</Text>
          <Text style={styles.valueAmount}>{fatura.amount}</Text>
        </View>
        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>Você economizou</Text>
          <Text style={[styles.valueAmount, styles.savings]}>{fatura.savings}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => router.push(`/invoice/${fatura.id}` as any)}
        activeOpacity={0.8}
      >
        <Text style={styles.detailsButtonText}>Ver detalhes</Text>
        <Ionicons name="arrow-forward" size={18} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export default function InvoicesScreen() {
  return (
    <View style={styles.container}>
      {/* Header verde */}
      <GradientHeader variant="title">
        <Text style={styles.headerTitle}>Minhas faturas</Text>
        <Text style={styles.headerSub}>Suas contas de energia, mês a mês</Text>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mockFaturas.map((fatura) => (
          <FaturaCard key={fatura.id} fatura={fatura} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.white,
  },
  headerSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.greenAccentLight,
    opacity: 0.9,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
    gap: spacing.base,
  },
  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.lg,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  month: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.textDark,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.greenBg,
    borderRadius: radius.full,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.primary,
  },
  valuesRow: {
    flexDirection: 'row',
    gap: spacing.base,
  },
  valueBlock: {
    flex: 1,
    gap: 3,
  },
  valueLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.textMedium,
  },
  valueAmount: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h2,
    color: colors.textDark,
  },
  savings: {
    color: colors.primary,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.greenBg,
    borderRadius: 14,
    minHeight: 52,
    paddingVertical: spacing.base,
  },
  detailsButtonText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.primary,
  },
});
