import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  PanResponder,
  Easing,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  mockAvisos,
  avisoFilters,
  Aviso,
  AvisoType,
  RECADO_MESSAGE,
  RECADO_ICON_COLOR,
  RECADO_ICON_BG,
} from '@/mocks/avisos.mock';
import { useAvisoStore } from '@/stores/avisoStore';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

function AvisoCard({
  aviso,
  unread,
  onAction,
}: {
  aviso: Aviso;
  unread: boolean;
  onAction: (aviso: Aviso) => void;
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: aviso.iconBg }]}>
        <Ionicons name={aviso.icon} size={24} color={aviso.iconColor} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle}>{aviso.title}</Text>
          {unread && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.cardDescription}>{aviso.description}</Text>
        <Text style={styles.cardDatetime}>{aviso.datetime}</Text>

        {aviso.actionLabel && (
          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => onAction(aviso)}
            activeOpacity={0.85}
          >
            <Text style={styles.cardButtonText}>{aviso.actionLabel}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const SHEET_OFFSCREEN = Dimensions.get('window').height;

export default function NoticesScreen() {
  const [filter, setFilter] = useState<AvisoType | 'todos'>('todos');
  const [recadoOpen, setRecadoOpen] = useState(false);
  const readIds = useAvisoStore((s) => s.readIds);
  const markAsRead = useAvisoStore((s) => s.markAsRead);

  // Posição vertical da aba do recado (só a aba desliza; o overlay escurece direto).
  const translateY = useRef(new Animated.Value(SHEET_OFFSCREEN)).current;

  const visibleAvisos =
    filter === 'todos'
      ? mockAvisos
      : mockAvisos.filter((a) => a.type === filter);

  // Ao abrir, a aba sobe de baixo para cima.
  useEffect(() => {
    if (recadoOpen) {
      translateY.setValue(SHEET_OFFSCREEN);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [recadoOpen]);

  // Fecha animando a aba para baixo e só então desmonta o modal.
  function closeRecado() {
    Animated.timing(translateY, {
      toValue: SHEET_OFFSCREEN,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      markAsRead('aviso-3');
      setRecadoOpen(false);
    });
  }

  // Arrastar a aba para baixo: solta longe → fecha; solta perto → volta ao aberto.
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        g.dy > 6 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 110 || g.vy > 0.9) {
          closeRecado();
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 2,
          }).start();
        }
      },
    }),
  ).current;

  function handleAction(aviso: Aviso) {
    switch (aviso.action) {
      case 'ver-pagamento':
      case 'pagar-agora':
        router.push('/payment/jun-2026' as any);
        break;
      case 'ler-recado':
        setRecadoOpen(true);
        break;
    }
  }

  return (
    <View style={styles.container}>
      {/* Header verde */}
      <GradientHeader variant="title">
        <Text style={styles.headerTitle}>Avisos</Text>
        <Text style={styles.headerSub}>Vencimentos, cobranças e recados</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {avisoFilters.map((f) => {
            const active = f.key === filter;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.pill, active && styles.pillActive]}
                onPress={() => setFilter(f.key)}
                activeOpacity={0.8}
              >
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </GradientHeader>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {visibleAvisos.map((aviso) => (
          <AvisoCard
            key={aviso.id}
            aviso={aviso}
            unread={!readIds.includes(aviso.id)}
            onAction={handleAction}
          />
        ))}
      </ScrollView>

      {/* Bottom sheet do recado */}
      <Modal
        visible={recadoOpen}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeRecado}
      >
        <View style={styles.overlay}>
          {/* Overlay escuro: escurece direto (sem slide) e fecha ao tocar fora */}
          <Pressable style={StyleSheet.absoluteFill} onPress={closeRecado} />
          <Animated.View
            style={[styles.sheet, { transform: [{ translateY }] }]}
            {...panResponder.panHandlers}
          >
            <View style={styles.sheetHandle} />
            <View style={[styles.sheetIcon, { backgroundColor: RECADO_ICON_BG }]}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={28}
                color={RECADO_ICON_COLOR}
              />
            </View>
            <Text style={styles.sheetTitle}>Recado importante</Text>
            <Text style={styles.sheetText}>{RECADO_MESSAGE}</Text>
            <TouchableOpacity
              style={styles.sheetButton}
              onPress={closeRecado}
              activeOpacity={0.85}
            >
              <Text style={styles.sheetButtonText}>Entendido</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Header
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
  filters: {
    gap: spacing.sm,
    paddingTop: spacing.base,
    paddingRight: spacing.xl,
  },
  pill: {
    backgroundColor: colors.white,
    borderRadius: radius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  pillActive: {
    backgroundColor: colors.primaryDarker,
    borderWidth: 1,
    borderColor: colors.greenAccentMid,
  },
  pillText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textMedium,
  },
  pillTextActive: {
    color: colors.white,
  },
  // Content
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
    gap: spacing.base,
  },
  // Card
  card: {
    flexDirection: 'row',
    gap: spacing.base,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    flex: 1,
    gap: 5,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  cardTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },
  cardDescription: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textMedium,
    lineHeight: 22,
  },
  cardDatetime: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  cardButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 14,
    minHeight: 46,
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  cardButtonText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.white,
  },
  // Bottom sheet
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    gap: spacing.base,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D9D4',
    marginBottom: spacing.sm,
  },
  sheetIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h2,
    color: colors.textDark,
    textAlign: 'center',
  },
  sheetText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textMedium,
    lineHeight: 22,
    textAlign: 'center',
  },
  sheetButton: {
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sheetButtonText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.white,
  },
});
