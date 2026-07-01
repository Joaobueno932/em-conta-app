import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Header verde padrão do app, fiel ao protótipo:
 * gradiente linear-gradient(160deg, #1FB35C 0%, #0E7A3D 100%),
 * cantos inferiores arredondados e respeito à Safe Area (status bar).
 *
 * As medidas por variante replicam os paddings do protótipo (o paddingTop
 * é somado ao inset da status bar do dispositivo).
 */
type Variant = 'home' | 'title' | 'detail' | 'profile';

const SPEC: Record<Variant, { top: number; horizontal: number; bottom: number; radius: number }> = {
  home: { top: 16, horizontal: 22, bottom: 20, radius: 30 },
  title: { top: 24, horizontal: 22, bottom: 26, radius: 28 },
  detail: { top: 18, horizontal: 18, bottom: 26, radius: 28 },
  profile: { top: 26, horizontal: 22, bottom: 34, radius: 30 },
};

// Gradiente exato do protótipo.
const GRADIENT_COLORS = ['#1FB35C', '#0E7A3D'] as const;

interface GradientHeaderProps {
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function GradientHeader({ variant = 'title', style, children }: GradientHeaderProps) {
  const insets = useSafeAreaInsets();
  const spec = SPEC[variant];

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        {
          paddingTop: insets.top + spec.top,
          paddingHorizontal: spec.horizontal,
          paddingBottom: spec.bottom,
          borderBottomLeftRadius: spec.radius,
          borderBottomRightRadius: spec.radius,
        },
        style,
      ]}
    >
      {children}
    </LinearGradient>
  );
}
