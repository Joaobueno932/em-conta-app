import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { authService } from '@/services/authService';
import { storageService } from '@/services/storageService';
import { useAuthStore } from '@/stores/authStore';
import { mockUser } from '@/mocks/user.mock';
import { Loading } from '@/components/ui/Loading';

const ONBOARDING_KEY = 'onboarding_completed';

export default function Index() {
  const { isAuthenticated, onboardingCompleted, setAuth, setOnboardingCompleted } =
    useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const [token, onboarding] = await Promise.all([
        authService.getStoredToken(),
        storageService.getItem(ONBOARDING_KEY),
      ]);

      if (onboarding === 'true') {
        setOnboardingCompleted();
      }

      if (token) {
        setAuth(token, mockUser);
      }

      setChecking(false);
    }

    if (isAuthenticated) {
      setChecking(false);
    } else {
      checkSession();
    }
  }, []);

  if (checking) return <Loading message="Iniciando..." />;

  if (isAuthenticated && onboardingCompleted) return <Redirect href="/(tabs)/home" />;

  if (isAuthenticated && !onboardingCompleted) return <Redirect href="/auth/onboarding" />;

  return <Redirect href="/auth/login" />;
}
