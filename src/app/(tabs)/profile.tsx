import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { useUnitStore } from '@/stores/unitStore';
import { authService } from '@/services/authService';
import { colors } from '@/constants/colors';
import { fontFamily, fontSize } from '@/constants/typography';
import { spacing, radius } from '@/constants/spacing';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface MenuRowProps {
  icon: IconName;
  label: string;
  onPress: () => void;
  last?: boolean;
}

function MenuRow({ icon, label, onPress, last }: MenuRowProps) {
  return (
    <TouchableOpacity
      style={[styles.row, !last && styles.rowDivider]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const selectedUnit = useUnitStore((s) => s.selectedUnit);

  const initial = user?.name?.trim().charAt(0).toUpperCase() ?? '?';

  function handleLogout() {
    Alert.alert('Sair da conta', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
          clearAuth();
          router.replace('/auth/login');
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <Text style={styles.headerSub}>Seus dados e ajuda</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Dados do usuário */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.userName}>{user?.name ?? 'Cliente'}</Text>
          {!!user?.email && (
            <View style={styles.userMetaRow}>
              <Ionicons name="mail-outline" size={16} color={colors.textLight} />
              <Text style={styles.userMeta}>{user.email}</Text>
            </View>
          )}
          {!!user?.phone && (
            <View style={styles.userMetaRow}>
              <Ionicons name="call-outline" size={16} color={colors.textLight} />
              <Text style={styles.userMeta}>{user.phone}</Text>
            </View>
          )}
          {!!user?.cpf && (
            <View style={styles.userMetaRow}>
              <Ionicons name="card-outline" size={16} color={colors.textLight} />
              <Text style={styles.userMeta}>{user.cpf}</Text>
            </View>
          )}
        </View>

        {/* Unidade ativa */}
        {selectedUnit && (
          <View style={styles.unitCard}>
            <View style={styles.unitHeader}>
              <View style={styles.unitIcon}>
                <Ionicons name="home" size={22} color={colors.primary} />
              </View>
              <View style={styles.unitInfo}>
                <Text style={styles.unitLabel}>Unidade ativa</Text>
                <Text style={styles.unitName} numberOfLines={1}>{selectedUnit.name}</Text>
                <Text style={styles.unitAddress} numberOfLines={1}>
                  {selectedUnit.address} — {selectedUnit.city}/{selectedUnit.state}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.unitBtn}
              onPress={() => router.push('/units' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.unitBtnText}>Trocar unidade</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Minha conta */}
        <Text style={styles.sectionTitle}>Minha conta</Text>
        <View style={styles.menuCard}>
          <MenuRow icon="home-outline" label="Minhas unidades" onPress={() => router.push('/units' as any)} />
          <MenuRow icon="notifications-outline" label="Avisos" onPress={() => router.push('/(tabs)/notices' as any)} />
          <MenuRow icon="document-text-outline" label="Faturas" onPress={() => router.push('/(tabs)/invoices' as any)} last />
        </View>

        {/* Ajuda */}
        <Text style={styles.sectionTitle}>Ajuda</Text>
        <View style={styles.menuCard}>
          <MenuRow icon="headset-outline" label="Suporte" onPress={() => router.push('/support' as any)} />
          <MenuRow icon="help-circle-outline" label="Dúvidas frequentes" onPress={() => router.push('/support' as any)} last />
        </View>

        {/* Sair */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
  content: { padding: spacing.base, gap: spacing.base, paddingBottom: 40 },

  // User card
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.xl,
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 4,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.greenBg,
    borderWidth: 2,
    borderColor: colors.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h1,
    color: colors.primary,
  },
  userName: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.h2,
    color: colors.textDark,
    marginBottom: 4,
  },
  userMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userMeta: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.base,
    color: colors.textLight,
  },

  // Unit card
  unitCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.base,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  unitHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  unitIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitInfo: { flex: 1 },
  unitLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  unitName: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: colors.textDark,
    marginTop: 2,
  },
  unitAddress: {
    fontFamily: fontFamily.semiBold,
    fontSize: fontSize.sm,
    color: colors.textLight,
    marginTop: 1,
  },
  unitBtn: {
    height: 48,
    borderRadius: radius.button,
    backgroundColor: colors.greenBg,
    borderWidth: 1.5,
    borderColor: colors.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitBtnText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.base,
    color: colors.primaryDark,
  },

  // Sections
  sectionTitle: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.sm,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.sm,
    marginBottom: -spacing.sm,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.base,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.greenBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.lg,
    color: colors.textDark,
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    height: 56,
    borderRadius: radius.button,
    backgroundColor: colors.errorBg,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    marginTop: spacing.sm,
  },
  logoutText: {
    fontFamily: fontFamily.black,
    fontSize: fontSize.lg,
    color: colors.error,
  },
});
