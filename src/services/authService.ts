import { LoginCredentials } from '@/types/auth';
import { User } from '@/types/user';
import { mockUser, MOCK_EMAIL, MOCK_PASSWORD } from '@/mocks/user.mock';
import { storageService } from './storageService';

const TOKEN_KEY = 'auth_token';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    await new Promise((res) => setTimeout(res, 1200));

    if (
      credentials.email.toLowerCase() === MOCK_EMAIL &&
      credentials.password === MOCK_PASSWORD
    ) {
      const token = 'mock_token_emconta_2026';
      await storageService.setItem(TOKEN_KEY, token);
      return { token, user: mockUser };
    }

    throw new Error('Dados inválidos. Verifique e tente novamente.');
  },

  async logout(): Promise<void> {
    await storageService.deleteItem(TOKEN_KEY);
  },

  async getStoredToken(): Promise<string | null> {
    return storageService.getItem(TOKEN_KEY);
  },
};
