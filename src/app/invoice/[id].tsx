import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getFaturaById } from '@/mocks/faturas.mock';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { BottomTabBarMock } from '@/components/navigation/BottomTabBarMock';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

function DetailRow({
  label,
  value,
  highlight,
  last,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, highlight && styles.rowValueHighlight]}>
          {value}
        </Text>
      </View>
      {!last && <View style={styles.separator} />}
    </>
  );
}

export default function InvoiceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const fatura = getFaturaById(id);

  return (
    <View style={styles.container}>
      {/* Header verde */}
      <GradientHeader variant="detail">
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color={colors.white} />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerLabel}>Fatura de</Text>
        <Text style={styles.headerMonth}>{fatura.month}</Text>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Cards superiores */}
        <View style={styles.topCards}>
          <View style={styles.topCard}>
            <Text style={styles.topCardLabel}>Valor da conta</Text>
            <Text style={styles.topCardValue}>{fatura.amount}</Text>
          </View>
          <View style={[styles.topCard, styles.topCardGreen]}>
            <Text style={styles.topCardLabel}>Economia do mês</Text>
            <Text style={[styles.topCardValue, styles.topCardValueGreen]}>
              {fatura.savings}
            </Text>
          </View>
        </View>

        {/* Card de detalhes */}
        <View style={styles.detailsCard}>
          <DetailRow label="Unidade" value={fatura.unit} />
          <DetailRow label="Nº da instalação" value={fatura.installation} />
          <DetailRow label="Distribuidora" value={fatura.distributor} />
          <DetailRow label="Vencimento" value={fatura.dueDate} />
          <DetailRow label="Energia usada" value={fatura.energyUsed} />
          <DetailRow label="Energia limpa usada" value={fatura.cleanEnergyUsed} />
          <DetailRow
            label="Créditos guardados"
            value={fatura.storedCredits}
            highlight
            last
          />
        </View>

        {/* Botão baixar fatura */}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() =>
            Alert.alert('Baixar fatura', 'Sua fatura será baixada em instantes.')
          }
          activeOpacity={0.85}
        >
          <Ionicons name="download-outline" size={20} color={colors.white} />
          <Text style={styles.downloadButtonText}>Baixar fatura</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomTabBarMock active="invoices" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.full,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: spacing.base,
  },
  backText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.white,
  },
  headerLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.greenAccentLight,
  },
  headerMonth: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.white,
    lineHeight: 36,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.base,
  },
  // Top cards
  topCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  topCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.xs,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  topCardGreen: {
    backgroundColor: colors.greenBg,
  },
  topCardLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textMedium,
  },
  topCardValue: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h2,
    color: colors.textDark,
  },
  topCardValueGreen: {
    color: colors.primary,
  },
  // Details card
  detailsCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.base,
    gap: spacing.base,
  },
  rowLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
  },
  rowValue: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textDark,
    textAlign: 'right',
    flexShrink: 1,
  },
  rowValueHighlight: {
    color: colors.primary,
  },
  separator: { height: 1, backgroundColor: colors.border },
  // Download button
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.base,
    marginTop: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  downloadButtonText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.white,
  },
});
