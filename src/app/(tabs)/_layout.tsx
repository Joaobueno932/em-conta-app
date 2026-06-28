import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUnitStore } from '@/stores/unitStore';
import { useNoticeStore } from '@/stores/noticeStore';
import { noticeService } from '@/services/noticeService';
import { colors } from '@/constants/colors';
import { fontFamily } from '@/constants/typography';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

interface TabIconProps {
  name: IconName;
  focused: boolean;
}

function TabIcon({ name, focused }: TabIconProps) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={name}
        size={24}
        color={focused ? colors.primary : colors.textMuted}
      />
    </View>
  );
}

export default function TabsLayout() {
  const hydrated = useUnitStore((s) => s.hydrated);
  const loadUnits = useUnitStore((s) => s.loadUnits);
  const selectedUnit = useUnitStore((s) => s.selectedUnit);

  const noticesHydrated = useNoticeStore((s) => s.hydrated);
  const loadReadNotices = useNoticeStore((s) => s.loadReadNotices);
  const readIds = useNoticeStore((s) => s.readIds);

  useEffect(() => {
    if (!hydrated) loadUnits();
  }, [hydrated]);

  useEffect(() => {
    if (!noticesHydrated) loadReadNotices();
  }, [noticesHydrated]);

  const unreadCount = noticesHydrated
    ? noticeService
        .listForUnit(selectedUnit?.id)
        .filter((n) => !readIds.includes(n.id)).length
    : 0;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Início',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="invoices"
        options={{
          title: 'Faturas',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'document-text' : 'document-text-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notices"
        options={{
          title: 'Avisos',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: styles.tabBadge,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? 'notifications' : 'notifications-outline'}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? 'person' : 'person-outline'} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
    height: 76,
    paddingTop: 6,
    paddingBottom: 14,
  },
  tabItem: {
    paddingTop: 4,
  },
  tabLabel: {
    fontFamily: fontFamily.extraBold,
    fontSize: 11,
    marginTop: 2,
  },
  tabBadge: {
    backgroundColor: colors.error,
    color: colors.white,
    fontFamily: fontFamily.extraBold,
    fontSize: 10,
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
});
