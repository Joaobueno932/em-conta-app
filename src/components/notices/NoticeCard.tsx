import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Notice, NoticeType } from '@/types/notice';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

const typeConfig: Record<NoticeType, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  info: { icon: 'information-circle-outline', color: colors.primaryDark, bg: colors.greenBg },
  warning: { icon: 'warning-outline', color: colors.orange, bg: colors.orangeBg },
  success: { icon: 'checkmark-circle-outline', color: colors.primary, bg: colors.successBg },
  alert: { icon: 'alert-circle-outline', color: colors.error, bg: colors.errorBg },
};

interface NoticeCardProps {
  notice: Notice;
  onPress: () => void;
}

export function NoticeCard({ notice, onPress }: NoticeCardProps) {
  const config = typeConfig[notice.type];

  return (
    <TouchableOpacity style={[styles.card, !notice.read && styles.unread]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
        <Ionicons name={config.icon} size={24} color={config.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{notice.title}</Text>
        <Text style={styles.body} numberOfLines={2}>{notice.body}</Text>
      </View>
      {!notice.read && <View style={styles.dot} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  unread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: { flex: 1 },
  title: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textDark,
  },
  body: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 3,
    lineHeight: 18,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    flexShrink: 0,
  },
});
