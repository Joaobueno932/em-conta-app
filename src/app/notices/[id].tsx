import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Notice, NoticeType } from '@/types/notice';
import { noticeService } from '@/services/noticeService';
import { Loading } from '@/components/ui/Loading';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

const typeIcon: Record<NoticeType, React.ComponentProps<typeof Ionicons>['name']> = {
  info: 'information-circle-outline',
  warning: 'warning-outline',
  success: 'checkmark-circle-outline',
  alert: 'alert-circle-outline',
};

const typeColor: Record<NoticeType, string> = {
  info: colors.primaryDark,
  warning: colors.orange,
  success: colors.primary,
  alert: colors.error,
};

const typeBg: Record<NoticeType, string> = {
  info: colors.greenBg,
  warning: colors.orangeBg,
  success: colors.successBg,
  alert: colors.errorBg,
};

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noticeService.getAll().then((list) => {
      const found = list.find((n) => n.id === id) ?? null;
      setNotice(found);
      if (found && !found.read) noticeService.markAsRead(id);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!notice) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Aviso não encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const color = typeColor[notice.type];
  const bg = typeBg[notice.type];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aviso</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.iconCircle, { backgroundColor: bg }]}>
          <Ionicons name={typeIcon[notice.type]} size={40} color={color} />
        </View>

        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.body}>{notice.body}</Text>

        <View style={styles.meta}>
          <Ionicons name="time-outline" size={16} color={colors.textMuted} />
          <Text style={styles.date}>
            {new Date(notice.createdAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryDark,
    paddingTop: 56,
    paddingBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.white,
  },
  content: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingBottom: 40,
    gap: spacing.base,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h2,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 32,
  },
  body: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 28,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  date: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  notFoundText: { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.textMedium },
  backLink: { fontFamily: fontFamily.extraBold, fontSize: fontSize.base, color: colors.primary },
});
