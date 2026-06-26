import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

const slides = [
  {
    image: require('@/assets/images/mascote-feliz.png'),
    title: 'Bem-vindo ao Em Conta!',
    desc: 'Acompanhe sua energia renovável de qualquer lugar, a qualquer hora.',
  },
  {
    image: require('@/assets/images/mascote-fatura.png'),
    title: 'Faturas na palma da mão',
    desc: 'Veja suas faturas, copie o código Pix e pague em segundos.',
  },
  {
    image: require('@/assets/images/mascote-voando.png'),
    title: 'Economia real todo mês',
    desc: 'Acompanhe quanto você está economizando e ajudando o planeta.',
  },
];

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];

  function handleNext() {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      router.replace('/(tabs)/home');
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(tabs)/home')}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.imageCircle}>
          <Image source={slide.image} style={styles.mascote} resizeMode="contain" />
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.desc}>{slide.desc}</Text>
      </View>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === current ? styles.dotActive : styles.dotInactive]}
          />
        ))}
      </View>

      <Button
        label={current < slides.length - 1 ? 'Próximo' : 'Começar'}
        onPress={handleNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.xl,
    paddingTop: 24,
    paddingBottom: spacing.xl,
  },
  skipBtn: { alignSelf: 'flex-end', padding: spacing.sm },
  skipText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.textLight,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.base,
  },
  imageCircle: {
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  mascote: { width: 190, height: 190 },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.display,
    color: colors.primaryDark,
    textAlign: 'center',
    lineHeight: 38,
    maxWidth: 300,
  },
  desc: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.textMedium,
    textAlign: 'center',
    lineHeight: 28,
    maxWidth: 300,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: spacing.xl,
  },
  dot: { height: 10, borderRadius: 5 },
  dotActive: { width: 28, backgroundColor: colors.primary },
  dotInactive: { width: 10, backgroundColor: colors.border },
});
