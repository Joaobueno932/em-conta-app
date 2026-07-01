import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail ou telefone.'),
  password: z.string().min(1, 'Informe sua senha.'),
});

type LoginForm = z.infer<typeof loginSchema>;

// Cadastro externo (abre no navegador).
const REGISTER_URL = 'https://emconta.gdash.io/calculate-economy/KBaRscPnimx0EFU6gWnPo';

export default function LoginScreen() {
  const [apiError, setApiError] = useState('');
  const { setAuth, onboardingCompleted } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setApiError('');
    try {
      const { token, user } = await authService.login(data);
      setAuth(token, user);
      router.replace(onboardingCompleted ? '/(tabs)/home' : '/auth/onboarding');
    } catch (err: any) {
      setApiError(err.message ?? 'Não foi possível entrar. Tente novamente.');
    }
  }

  function handleForgotPassword() {
    Alert.alert('Em breve', 'A recuperação de senha estará disponível em breve.');
  }

  async function handleRegister() {
    try {
      await Linking.openURL(REGISTER_URL);
    } catch {
      Alert.alert('Ops', 'Não foi possível abrir o cadastro agora. Tente novamente.');
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoArea}>
          <Image
            source={require('@/assets/images/logo-em-conta.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Image
            source={require('@/assets/images/mascote-aceno.png')}
            style={styles.mascote}
            resizeMode="contain"
          />
          <Text style={styles.title}>Acesse sua conta</Text>
          <Text style={styles.subtitle}>
            Entre para acompanhar suas faturas, avisos e pagamentos.
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                label="E-mail ou telefone"
                placeholder="seu@email.com"
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Senha"
                placeholder="••••••••"
                value={value}
                onChangeText={onChange}
                secureTextEntry
                secureToggle
                error={errors.password?.message}
              />
            )}
          />

          {!!apiError && (
            <View style={styles.errorBox}>
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={colors.error}
                style={styles.errorIcon}
              />
              <Text style={styles.errorText}>{apiError}</Text>
            </View>
          )}
        </View>

        <Button
          label="Entrar"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          style={styles.loginBtn}
        />

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={handleForgotPassword}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerCard}
          onPress={handleRegister}
          activeOpacity={0.8}
        >
          <View style={styles.registerIcon}>
            <Ionicons name="person-add-outline" size={22} color={colors.white} />
          </View>
          <View style={styles.registerInfo}>
            <Text style={styles.registerTitle}>Quero me cadastrar</Text>
            <Text style={styles.registerSub}>Calcule sua economia agora</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: 52,
    paddingBottom: spacing.xl,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 220,
    height: 80,
  },
  mascote: {
    width: 160,
    height: 160,
    marginVertical: 8,
  },
  title: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.primaryDark,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.lg,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  form: {
    marginBottom: spacing.sm,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.errorBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorIcon: {
    flexShrink: 0,
  },
  errorText: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.error,
    lineHeight: 20,
  },
  loginBtn: {
    width: '100%',
    marginTop: spacing.base,
  },
  forgotBtn: {
    alignItems: 'center',
    paddingVertical: spacing.base,
    marginBottom: spacing.xs,
  },
  forgotText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.primaryDark,
  },
  registerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.greenBgMid,
    borderWidth: 2,
    borderColor: colors.greenBorder,
    borderRadius: radius.xl,
    padding: spacing.base,
  },
  registerIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  registerInfo: {
    flex: 1,
  },
  registerTitle: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.xl,
    color: colors.primaryDark,
  },
  registerSub: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.textMedium,
    marginTop: 2,
  },
});
