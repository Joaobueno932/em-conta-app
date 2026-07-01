import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { useAuthStore } from '@/stores/authStore';
import { useUnitStore } from '@/stores/unitStore';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

// Dados mockados desta etapa (sem integração com API)
const MOCK = {
  savingsMonth: 'R$ 187,40',
  savingsTotal: 'R$ 2.146,80',
  consumption: '412 kWh',
  nextChargeAmount: 'R$ 243,90',
  nextChargeDays: 5,
  nextChargeDate: '30/06',
  co2Avoided: '38 kg',
};

// Gráfico "Sua economia mês a mês" — alturas relativas (0-100).
// Cinza (sem Em Conta) maior, verde (com Em Conta) menor.
const CHART: { month: string; without: number; with: number }[] = [
  { month: 'Jan', without: 90, with: 55 },
  { month: 'Fev', without: 84, with: 50 },
  { month: 'Mar', without: 96, with: 58 },
  { month: 'Abr', without: 88, with: 46 },
  { month: 'Mai', without: 92, with: 52 },
  { month: 'Jun', without: 86, with: 44 },
];

const CHART_HEIGHT = 130;

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const firstName = user?.name?.split(' ')[0] ?? 'João';
  const units = useUnitStore((s) => s.units);
  const activeCount = units.length || 1;

  return (
    <View style={styles.container}>
      {/* 1. Header verde */}
      <GradientHeader variant="home" style={styles.headerRow}>
        <View>
          <Text style={styles.greeting}>Olá,</Text>
          <Text style={styles.userName}>{firstName} 👋</Text>
        </View>
        <TouchableOpacity
          style={styles.bellButton}
          onPress={() => router.push('/(tabs)/notices' as any)}
          activeOpacity={0.8}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.white} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Card de economia */}
        <Card style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <Text style={styles.leafEmoji}>🌱</Text>
            <Text style={styles.savingsLabel}>Você economizou este mês</Text>
          </View>
          <Text style={styles.savingsValue}>{MOCK.savingsMonth}</Text>

          <View style={styles.miniRow}>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>Total economizado</Text>
              <Text style={styles.miniValue}>{MOCK.savingsTotal}</Text>
            </View>
            <View style={styles.miniCard}>
              <Text style={styles.miniLabel}>Consumo do mês</Text>
              <Text style={styles.miniValue}>{MOCK.consumption}</Text>
            </View>
          </View>
        </Card>

        {/* 3. Card de próxima cobrança */}
        <Card style={styles.chargeCard}>
          <View style={styles.chargeTop}>
            <View style={styles.calendarIcon}>
              <Ionicons name="calendar-outline" size={26} color={colors.white} />
            </View>
            <View style={styles.chargeInfo}>
              <Text style={styles.chargeTitle}>
                Sua próxima cobrança vence em{' '}
                <Text style={styles.chargeDays}>{MOCK.nextChargeDays} dias</Text>
              </Text>
              <Text style={styles.chargeSub}>
                {MOCK.nextChargeAmount} · vence {MOCK.nextChargeDate}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.chargeButton}
            onPress={() => router.push('/payment/jun-2026' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.chargeButtonText}>Ver pagamento</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        </Card>

        {/* 4. Card de gráfico */}
        <Card>
          <Text style={styles.chartTitle}>Sua economia mês a mês</Text>
          <Text style={styles.chartDesc}>
            O verde mostra quanto você paga com o Em Conta.
          </Text>

          <View style={styles.chart}>
            {CHART.map((item) => (
              <View key={item.month} style={styles.chartCol}>
                <View style={styles.chartBars}>
                  <View
                    style={[
                      styles.bar,
                      styles.barWithout,
                      { height: (item.without / 100) * CHART_HEIGHT },
                    ]}
                  />
                  <View
                    style={[
                      styles.bar,
                      styles.barWith,
                      { height: (item.with / 100) * CHART_HEIGHT },
                    ]}
                  />
                </View>
                <Text style={styles.chartMonth}>{item.month}</Text>
              </View>
            ))}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
              <Text style={styles.legendText}>Sem Em Conta</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Com Em Conta</Text>
            </View>
          </View>
        </Card>

        {/* 5. Card energia limpa */}
        <View style={styles.cleanCard}>
          <Image
            source={require('@/assets/images/mascote-heroi.png')}
            style={styles.cleanMascot}
            resizeMode="contain"
          />
          <View style={styles.cleanInfo}>
            <Text style={styles.cleanTitle}>Energia limpa 🌎</Text>
            <Text style={styles.cleanText}>
              Sua energia ajudou a evitar {MOCK.co2Avoided} de CO₂ este mês.
            </Text>
          </View>
        </View>

        {/* 6. Card minhas unidades */}
        <TouchableOpacity
          style={styles.unitsCard}
          onPress={() => router.push('/units' as any)}
          activeOpacity={0.85}
        >
          <View style={styles.unitsIcon}>
            <Ionicons name="home" size={22} color={colors.primary} />
          </View>
          <View style={styles.unitsInfo}>
            <Text style={styles.unitsTitle}>Minhas unidades</Text>
            <Text style={styles.unitsSub}>
              {activeCount} unidade{activeCount > 1 ? 's' : ''} ativa
              {activeCount > 1 ? 's' : ''}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // 1. Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.greenAccentLight,
  },
  userName: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.white,
    lineHeight: 34,
    marginTop: 2,
  },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.base,
  },
  // 2. Economia
  savingsCard: {
    gap: spacing.md,
  },
  savingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  leafEmoji: {
    fontSize: 22,
  },
  savingsLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textMedium,
  },
  savingsValue: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.hero,
    color: colors.primary,
    lineHeight: 50,
    letterSpacing: -1,
  },
  miniRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  miniCard: {
    flex: 1,
    backgroundColor: colors.greenBgSubtle,
    borderRadius: radius.lg,
    padding: spacing.base,
    gap: spacing.xs,
  },
  miniLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  miniValue: {
    fontFamily: fontFamily.black,
    fontSize: 21,
    color: colors.primaryDark,
  },
  // 3. Cobrança
  chargeCard: {
    backgroundColor: colors.orangeBg,
    borderWidth: 2,
    borderColor: colors.orangeBorder,
    gap: spacing.base,
  },
  chargeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  calendarIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chargeInfo: {
    flex: 1,
    gap: 4,
  },
  chargeTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textDark,
    lineHeight: 23,
  },
  chargeDays: {
    color: colors.orange,
  },
  chargeSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
  },
  chargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.orange,
    borderRadius: 14,
    minHeight: 50,
    paddingVertical: spacing.base,
  },
  chargeButtonText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.white,
  },
  // 4. Gráfico
  chartTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.textDark,
  },
  chartDesc: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.textLight,
    marginTop: 4,
    marginBottom: 18,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: CHART_HEIGHT,
  },
  chartCol: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: CHART_HEIGHT,
  },
  bar: {
    width: 12,
    borderRadius: radius.sm,
  },
  barWithout: {
    backgroundColor: colors.border,
  },
  barWith: {
    backgroundColor: colors.primary,
  },
  chartMonth: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  legendDot: {
    width: 13,
    height: 13,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  // 5. Energia limpa
  cleanCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
    backgroundColor: colors.primaryDarker,
    borderRadius: radius.card,
    padding: spacing.lg,
  },
  cleanMascot: {
    width: 72,
    height: 72,
  },
  cleanInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  cleanTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h3,
    color: colors.white,
  },
  cleanText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.greenAccentLight,
    lineHeight: 20,
  },
  // 6. Minhas unidades
  unitsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  unitsIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitsInfo: {
    flex: 1,
  },
  unitsTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: colors.textDark,
  },
  unitsSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textMedium,
    marginTop: 2,
  },
});
