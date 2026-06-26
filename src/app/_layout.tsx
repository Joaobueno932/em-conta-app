import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="invoice/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="invoice/payment" options={{ presentation: 'modal' }} />
        <Stack.Screen name="notices/[id]" options={{ presentation: 'card' }} />
        <Stack.Screen name="units/index" options={{ presentation: 'card' }} />
        <Stack.Screen name="support/index" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}
