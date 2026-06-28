import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Notice } from '@/types/notice';
import { noticeService } from '@/services/noticeService';
import { useUnitStore } from '@/stores/unitStore';
import { useNoticeStore } from '@/stores/noticeStore';
import { NoticeCard } from '@/components/notices/NoticeCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loading } from '@/components/ui/Loading';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

function formatNoticeDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function NoticesScreen() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const selectedUnit = useUnitStore((s) => s.selectedUnit);
  const readIds = useNoticeStore((s) => s.readIds);

  useEffect(() => {
    let active = true;
    setLoading(true);
    noticeService
      .getByUnitIdWithDerivedDueSoon(selectedUnit?.id)
      .then((list) => { if (active) setNotices(list); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [selectedUnit?.id]);

  const unreadCount = notices.filter((n) => !readIds.includes(n.id)).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Avisos</Text>
        <Text style={styles.headerSub}>Veja comunicados importantes da sua unidade.</Text>
        {selectedUnit && (
          <View style={styles.unitChip}>
            <Ionicons name="home" size={14} color={colors.primaryDark} />
            <Text style={styles.unitChipText} numberOfLines={1}>{selectedUnit.name}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <Loading message="Carregando avisos..." />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {notices.length === 0 ? (
            <EmptyState
              icon="notifications-outline"
              title="Nenhum aviso no momento"
              subtitle="Quando houver recados ou comunicados importantes, eles aparecerão aqui."
            />
          ) : (
            <>
              <Text style={styles.summary}>
                {unreadCount > 0
                  ? `${unreadCount} ${unreadCount === 1 ? 'aviso não lido' : 'avisos não lidos'}`
                  : 'Todos os avisos foram lidos.'}
              </Text>
              {notices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  type={notice.type}
                  title={notice.title}
                  message={notice.message}
                  date={formatNoticeDate(notice.createdAt)}
                  unitName={selectedUnit?.name}
                  read={readIds.includes(notice.id)}
                  onPress={() => router.push(`/notices/${notice.id}` as any)}
                />
              ))}
            </>
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
  unitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: colors.greenBg,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    borderRadius: radius.full,
    paddingVertical: 6,
    paddingHorizontal: 12,
    maxWidth: '100%',
  },
  unitChipText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.primaryDark,
    flexShrink: 1,
  },
  content: {
    padding: spacing.base,
    gap: spacing.md,
    paddingBottom: 40,
  },
  summary: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginBottom: -spacing.xs,
  },
});
