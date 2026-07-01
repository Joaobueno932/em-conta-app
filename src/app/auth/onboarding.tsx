import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { storageService } from '@/services/storageService';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

const ONBOARDING_KEY = 'onboarding_completed';

const slides = [
  {
    image: require('@/assets/images/mascote-feliz.png'),
    title: 'Bem-vindo ao Em Conta!',
    desc: 'Acompanhe suas faturas, avisos e pagamentos de energia em um só lugar.',
  },
  {
    image: require('@/assets/images/mascote-fatura.png'),
    title: 'Veja suas faturas',
    desc: 'Consulte valores, vencimentos e o status de cada pagamento.',
  },
  {
    image: require('@/assets/images/mascote-fatura-sem-fundo.png'),
    title: 'Receba avisos importantes',
    desc: 'Fique atento a vencimentos, cobranças e recados da sua conta.',
  },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const setOnboardingCompleted = useAuthStore((s) => s.setOnboardingCompleted);
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  async function finish() {
    if (finishing) return;
    setFinishing(true);
    await storageService.setItem(ONBOARDING_KEY, 'true');
    setOnboardingCompleted();
    router.replace('/(tabs)/home');
  }

  function handleNext() {
    if (isLast) {
      finish();
    } else {
      setCurrent((c) => c + 1);
    }
  }

  // Arrastar para os lados navega entre os slides (só entre eles; não finaliza).
  const swipeResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dx <= -40) {
          setCurrent((c) => Math.min(c + 1, slides.length - 1)); // esquerda → próximo
        } else if (g.dx >= 40) {
          setCurrent((c) => Math.max(c - 1, 0)); // direita → anterior
        }
      },
    }),
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image
          source={require('@/assets/images/logo-em-conta.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity style={styles.skipBtn} onPress={finish} activeOpacity={0.7}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content} {...swipeResponder.panHandlers}>
        <View style={styles.imageCircle}>
          <Image source={slide.image} style={styles.mascote} resizeMode="contain" />
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === current ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        <Button
          label={isLast ? 'Começar' : 'Próximo'}
          onPress={handleNext}
          loading={finishing}
          style={styles.btn}
        />

        {!isLast && (
          <View style={styles.progressHint}>
            <Text style={styles.progressText}>
              {current + 1} de {slides.length}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: 48,
    paddingBottom: spacing.base,
  },
  logo: {
    width: 120,
    height: 40,
  },
  skipBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.greenBg,
    borderRadius: radius.full,
  },
  skipText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.primaryDark,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.base,
  },
  imageCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.greenBg,
    borderWidth: 2,
    borderColor: colors.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  mascote: {
    width: 200,
    height: 200,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.display,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 40,
    maxWidth: 300,
  },
  desc: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 26,
    maxWidth: 300,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: spacing.md,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary,
  },
  dotInactive: {
    width: 10,
    backgroundColor: colors.border,
  },
  btn: {
    width: '100%',
  },
  progressHint: {
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  progressText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },
});
