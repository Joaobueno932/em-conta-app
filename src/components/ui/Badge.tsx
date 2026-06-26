import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius } from '@/constants/spacing';

interface BadgeProps {
  label: string;
  color: string;
  backgroundColor: string;
  style?: ViewStyle;
}

export function Badge({ label, color, backgroundColor, style }: BadgeProps) {
  return (
    <View style={[styles.badge, { backgroundColor }, style]}>
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
