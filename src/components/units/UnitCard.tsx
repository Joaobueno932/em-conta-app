import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Unit } from '@/types/unit';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const statusLabel: Record<Unit['status'], string> = {
  active: 'Ativa',
  inactive: 'Inativa',
  pending: 'Pendente',
};

const statusColor: Record<Unit['status'], string> = {
  active: colors.primary,
  inactive: colors.textMuted,
  pending: colors.orange,
};

interface UnitCardProps {
  unit: Unit;
  onPress?: () => void;
}

export function UnitCard({ unit, onPress }: UnitCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8} disabled={!onPress}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="home-outline" size={24} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{unit.name}</Text>
          <Text style={styles.address} numberOfLines={1}>{unit.address} — {unit.city}/{unit.state}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: statusColor[unit.status] }]}>
          <Text style={styles.statusText}>{statusLabel[unit.status]}</Text>
        </View>
      </View>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Consumo</Text>
          <Text style={styles.statValue}>{unit.consumption} kWh</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Economia</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>{unit.savingsPercent}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.md,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 4,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  name: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  address: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  statusDot: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.white,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: colors.greenBgSubtle,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  statValue: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
    marginTop: 2,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
});
