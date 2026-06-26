import axios from 'axios';
import { storageService } from './storageService';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.emconta.com.br';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await storageService.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storageService.deleteItem('auth_token');
    }
    return Promise.reject(error);
  }
);
