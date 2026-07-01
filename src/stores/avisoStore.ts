import { create } from 'zustand';
import { mockAvisos, defaultReadAvisoIds } from '@/mocks/avisos.mock';

/**
 * Estado local (em memória) de leitura dos avisos mockados.
 * Controla a bolinha vermelha dos cards e o badge da barra inferior.
 */
interface AvisoStore {
  readIds: string[];
  markAsRead: (id: string) => void;
  isRead: (id: string) => boolean;
  unreadCount: () => number;
}

export const useAvisoStore = create<AvisoStore>((set, get) => ({
  readIds: [...defaultReadAvisoIds],

  markAsRead: (id) => {
    if (get().readIds.includes(id)) return;
    set({ readIds: [...get().readIds, id] });
  },

  isRead: (id) => get().readIds.includes(id),

  unreadCount: () => mockAvisos.filter((a) => !get().readIds.includes(a.id)).length,
}));
