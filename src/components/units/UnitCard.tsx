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

const typeLabel: Record<Unit['type'], string> = {
  residential: 'Residencial',
  commercial: 'Comercial',
};

const typeIcon: Record<Unit['type'], React.ComponentProps<typeof Ionicons>['name']> = {
  residential: 'home-outline',
  commercial: 'storefront-outline',
};

interface UnitCardProps {
  unit: Unit;
  isActive?: boolean;
  onSelect?: () => void;
}

export function UnitCard({ unit, isActive = false, onSelect }: UnitCardProps) {
  return (
    <View style={[styles.card, isActive && styles.cardActive]}>
      <View style={styles.header}>
        <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
          <Ionicons name={typeIcon[unit.type]} size={24} color={colors.primary} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>{unit.name}</Text>
          <Text style={styles.address} numberOfLines={1}>
            {unit.address} — {unit.city}/{unit.state}
          </Text>
          <View style={styles.tagsRow}>
            <View style={styles.typeTag}>
              <Text style={styles.typeText}>{typeLabel[unit.type]}</Text>
            </View>
            <View style={[styles.statusTag, { backgroundColor: statusColor[unit.status] }]}>
              <Text style={styles.statusText}>{statusLabel[unit.status]}</Text>
            </View>
          </View>
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

      {isActive ? (
        <View style={styles.activeBadge}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
          <Text style={styles.activeBadgeText}>Unidade ativa</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.selectBtn} onPress={onSelect} activeOpacity={0.8}>
          <Text style={styles.selectBtnText}>Selecionar unidade</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 4,
  },
  cardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.greenBgMid,
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
  iconWrapActive: {
    backgroundColor: colors.greenAccentLight,
  },
  info: { flex: 1, gap: 2 },
  name: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  address: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    backgroundColor: colors.greenBg,
    borderWidth: 1,
    borderColor: colors.greenBorder,
  },
  typeText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.primaryDark,
  },
  statusTag: {
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
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 52,
    borderRadius: radius.button,
    backgroundColor: colors.greenBg,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
  },
  activeBadgeText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.base,
    color: colors.primaryDark,
  },
  selectBtn: {
    height: 52,
    borderRadius: radius.button,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  selectBtnText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.base,
    color: colors.white,
  },
});
