import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { radius, spacing } from '@/constants/spacing';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  secureToggle?: boolean;
}

export function Input({ label, error, secureToggle, secureTextEntry, ...props }: InputProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const isSecure = secureToggle ? !visible : secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, focused && styles.inputFocused, !!error && styles.inputError]}>
        <TextInput
          {...props}
          secureTextEntry={isSecure}
          style={styles.input}
          placeholderTextColor={colors.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {secureToggle && (
          <TouchableOpacity onPress={() => setVisible((v) => !v)} style={styles.eyeBtn}>
            <Ionicons name={visible ? 'eye-off' : 'eye'} size={22} color={colors.textLight} />
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.base },
  label: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.base,
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: spacing.base,
  },
  inputFocused: { borderColor: colors.borderFocus },
  inputError: { borderColor: colors.error },
  input: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxl,
    color: colors.textDark,
  },
  eyeBtn: { padding: spacing.xs },
  errorText: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
