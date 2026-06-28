import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Notice, NoticeType } from '@/types/notice';
import { noticeService } from '@/services/noticeService';
import { mockUnits } from '@/mocks/units.mock';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

const typeLabel: Record<NoticeType, string> = {
  due_soon: 'Vencimento próximo',
  charge: 'Cobrança',
  message: 'Recado',
  maintenance: 'Manutenção',
  general: 'Comunicado',
};

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

function formatNoticeDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function NoticeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noticeService
      .getById(id)
      .then((found) => {
        setNotice(found);
        if (!found.read) noticeService.markAsRead(found.id);
      })
      .catch(() => setNotice(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;

  if (!notice) {
    return (
      <View style={styles.notFound}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.notFoundText}>Aviso não encontrado.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/notices' as any)}>
          <Text style={styles.backLink}>Voltar para a central de avisos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const config = typeConfig[notice.type];
  const unitName = mockUnits.find((u) => u.id === notice.unitId)?.name;

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
        <View style={[styles.iconCircle, { backgroundColor: config.bg }]}>
          <Ionicons name={config.icon} size={40} color={config.color} />
        </View>

        <View style={[styles.typeTag, { backgroundColor: config.bg }]}>
          <Text style={[styles.typeTagText, { color: config.color }]}>{typeLabel[notice.type]}</Text>
        </View>

        <Text style={styles.title}>{notice.title}</Text>
        <Text style={styles.message}>{notice.message}</Text>

        <View style={styles.metaList}>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
            <Text style={styles.metaText}>{formatNoticeDate(notice.createdAt)}</Text>
          </View>
          {!!unitName && (
            <View style={styles.metaRow}>
              <Ionicons name="home-outline" size={18} color={colors.textMuted} />
              <Text style={styles.metaText}>{unitName}</Text>
            </View>
          )}
        </View>

        {notice.invoiceId && (
          <Button
            label="Ver fatura"
            onPress={() => router.push(`/invoice/${notice.invoiceId}` as any)}
            style={styles.invoiceBtn}
          />
        )}
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
    marginBottom: spacing.xs,
  },
  typeTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  typeTagText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h2,
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 32,
  },
  message: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 26,
  },
  metaList: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  metaText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
  },
  invoiceBtn: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  notFoundText: { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.textMedium },
  backLink: { fontFamily: fontFamily.extraBold, fontSize: fontSize.base, color: colors.primary },
});
