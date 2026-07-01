import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
type TabKey = 'home' | 'invoices' | 'payments' | 'notices' | 'profile';

const ITEMS: {
  key: TabKey;
  label: string;
  icon: IconName;
  iconActive: IconName;
  route: string;
  badge?: number;
}[] = [
  { key: 'home', label: 'Início', icon: 'home-outline', iconActive: 'home', route: '/(tabs)/home' },
  { key: 'invoices', label: 'Faturas', icon: 'document-text-outline', iconActive: 'document-text', route: '/(tabs)/invoices' },
  { key: 'payments', label: 'Pagamentos', icon: 'card-outline', iconActive: 'card', route: '/(tabs)/payments' },
  { key: 'notices', label: 'Avisos', icon: 'notifications-outline', iconActive: 'notifications', route: '/(tabs)/notices', badge: 3 },
  { key: 'profile', label: 'Perfil', icon: 'person-outline', iconActive: 'person', route: '/(tabs)/profile' },
];

/**
 * Barra inferior estática (visual) para telas empilhadas fora do grupo (tabs),
 * como detalhes de fatura e pagamento. Mantém a paridade visual com a barra real
 * e navega para as abas via replace.
 */
export function BottomTabBarMock({ active }: { active: TabKey }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBar, { paddingBottom: 12 + insets.bottom }]}>
      {ITEMS.map((item) => {
        const isActive = item.key === active;
        return (
          <TouchableOpacity
            key={item.key}
            style={styles.tabItem}
            onPress={() => router.replace(item.route as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconWrap, isActive && styles.iconWrapActive]}>
              <Ionicons
                name={isActive ? item.iconActive : item.icon}
                size={24}
                color={isActive ? colors.primary : colors.textMuted}
              />
              {item.badge ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[styles.label, isActive && styles.labelActive]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    paddingTop: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 4,
  },
  iconWrap: {
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: colors.greenBg,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontFamily: fontFamily.extraBold,
    fontSize: 10,
    color: colors.white,
  },
  label: {
    fontFamily: fontFamily.extraBold,
    fontSize: 11,
    marginTop: 2,
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
  },
});
