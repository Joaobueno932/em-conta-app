import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/services/authService';
import { perfilMock } from '@/mocks/perfil.mock';
import { GradientHeader } from '@/components/ui/GradientHeader';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

function DataRow({
  icon,
  label,
  value,
  last,
}: {
  icon: IconName;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.dataRow, !last && styles.dataRowDivider]}>
      <View style={styles.dataIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.dataInfo}>
        <Text style={styles.dataLabel}>{label}</Text>
        <Text style={styles.dataValue}>{value}</Text>
      </View>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  variant = 'default',
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  variant?: 'default' | 'primary' | 'danger';
}) {
  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      style={[
        styles.action,
        isPrimary && styles.actionPrimary,
        isDanger && styles.actionDanger,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View
        style={[
          styles.actionIcon,
          isPrimary && styles.actionIconPrimary,
          isDanger && styles.actionIconDanger,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={isDanger ? colors.error : colors.primary}
        />
      </View>
      <Text
        style={[
          styles.actionLabel,
          isPrimary && styles.actionLabelPrimary,
          isDanger && styles.actionLabelDanger,
        ]}
      >
        {label}
      </Text>
      {!isDanger && (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  async function doLogout() {
    try {
      await authService.logout();
    } finally {
      clearAuth();
      router.replace('/auth/login');
    }
  }

  function handleLogout() {
    // Alert.alert é no-op no web; usa o confirm nativo do navegador.
    if (Platform.OS === 'web') {
      const ok =
        typeof window === 'undefined' || window.confirm('Deseja sair da sua conta?');
      if (ok) doLogout();
      return;
    }
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: doLogout },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* Header verde */}
      <GradientHeader variant="profile" style={styles.headerCenter}>
        <Image
          source={require('@/assets/images/perfil.png')}
          style={styles.avatar}
          resizeMode="cover"
        />
        <Text style={styles.name}>{perfilMock.name}</Text>
        <Text style={styles.cpf}>{perfilMock.cpfMasked}</Text>
      </GradientHeader>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card de dados */}
        <View style={styles.dataCard}>
          <DataRow icon="mail-outline" label="E-mail" value={perfilMock.email} />
          <DataRow icon="call-outline" label="Telefone" value={perfilMock.phone} />
          <DataRow
            icon="home-outline"
            label="Unidade consumidora"
            value={perfilMock.consumerUnit}
          />
          <DataRow
            icon="flash-outline"
            label="Distribuidora"
            value={perfilMock.distributor}
            last
          />
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <ActionButton
            icon="home-outline"
            label="Minhas unidades"
            variant="primary"
            onPress={() => router.push('/units' as any)}
          />
          <ActionButton
            icon="create-outline"
            label="Editar meus dados"
            onPress={() => router.push('/profile/edit' as any)}
          />
          <ActionButton
            icon="lock-closed-outline"
            label="Alterar senha"
            onPress={() => router.push('/profile/password' as any)}
          />
          <ActionButton
            icon="chatbubble-ellipses-outline"
            label="Falar com suporte"
            onPress={() => router.push('/support' as any)}
          />
          <ActionButton
            icon="log-out-outline"
            label="Sair"
            variant="danger"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  // Header
  headerCenter: {
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    marginBottom: spacing.md,
  },
  name: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.white,
  },
  cpf: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.greenAccentLight,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: 40,
    gap: spacing.lg,
  },
  // Data card
  dataCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lg,
  },
  dataRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dataIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataInfo: { flex: 1 },
  dataLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.textMuted,
  },
  dataValue: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.textDark,
    marginTop: 2,
  },
  // Actions
  actions: { gap: spacing.md },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.lg,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  actionPrimary: {
    backgroundColor: colors.greenBg,
  },
  actionDanger: {
    backgroundColor: colors.errorBg,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconPrimary: {
    backgroundColor: colors.white,
  },
  actionIconDanger: {
    backgroundColor: colors.white,
  },
  actionLabel: {
    flex: 1,
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xl,
    color: colors.textDark,
  },
  actionLabelPrimary: {
    color: colors.primaryDark,
  },
  actionLabelDanger: {
    color: colors.error,
  },
});
