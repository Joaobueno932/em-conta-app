import { create } from 'zustand';
import { User } from '@/types/user';

interface AuthStore {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  onboardingCompleted: boolean;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  setOnboardingCompleted: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  onboardingCompleted: false,
  setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
  clearAuth: () => set({ token: null, user: null, isAuthenticated: false, onboardingCompleted: false }),
  setOnboardingCompleted: () => set({ onboardingCompleted: true }),
}));
