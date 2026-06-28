import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NoticeType } from '@/types/notice';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const typeConfig: Record<
  NoticeType,
  { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }
> = {
  due_soon: { icon: 'time-outline', color: colors.orange, bg: colors.orangeBg },
  charge: { icon: 'alert-circle-outline', color: colors.error, bg: colors.errorBg },
  message: { icon: 'chatbubble-ellipses-outline', color: colors.primaryDark, bg: colors.greenBg },
  maintenance: { icon: 'construct-outline', color: colors.textMedium, bg: colors.border },
  general: { icon: 'information-circle-outline', color: colors.primaryDark, bg: colors.greenBg },
};

interface NoticeCardProps {
  type?: NoticeType;
  title: string;
  message: string;
  date?: string;
  unitName?: string;
  highlighted?: boolean;
  /** Quando informado, exibe um botão de ação (ex.: "Ver fatura"). Sem ele, mostra "Abrir aviso". */
  actionLabel?: string;
  onPress?: () => void;
}

export function NoticeCard({
  type = 'general',
  title,
  message,
  date,
  unitName,
  highlighted = false,
  actionLabel,
  onPress,
}: NoticeCardProps) {
  const config = typeConfig[type];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        highlighted && { borderLeftWidth: 4, borderLeftColor: config.color },
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.85 : 1}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: config.color }]} numberOfLines={2}>
            {title}
          </Text>
          {!!unitName && <Text style={styles.unit} numberOfLines={1}>{unitName}</Text>}
        </View>
      </View>

      <Text style={styles.message} numberOfLines={3}>{message}</Text>

      {!!date && (
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
          <Text style={styles.date}>{date}</Text>
        </View>
      )}

      {actionLabel ? (
        <View style={[styles.action, { backgroundColor: config.color }]}>
          <Text style={styles.actionText}>{actionLabel}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.white} />
        </View>
      ) : (
        onPress && (
          <View style={styles.openHint}>
            <Text style={[styles.openHintText, { color: config.color }]}>Abrir aviso</Text>
            <Ionicons name="chevron-forward" size={16} color={config.color} />
          </View>
        )
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: { flex: 1 },
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
  },
  unit: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 2,
  },
  message: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
    lineHeight: 22,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textMedium,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    borderRadius: radius.button,
    marginTop: spacing.xs,
  },
  actionText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.base,
    color: colors.white,
  },
  openHint: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    gap: 2,
    marginTop: spacing.xs,
  },
  openHintText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
  },
});
