import { create } from 'zustand';
import { storageService } from '@/services/storageService';

const READ_KEY = 'read_notice_ids';

interface NoticeStore {
  readIds: string[];
  hydrated: boolean;
  loadReadNotices: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAsUnread: (id: string) => Promise<void>;
  isRead: (id: string) => boolean;
}

async function persist(ids: string[]): Promise<void> {
  await storageService.setItem(READ_KEY, JSON.stringify(ids));
}

export const useNoticeStore = create<NoticeStore>((set, get) => ({
  readIds: [],
  hydrated: false,

  loadReadNotices: async () => {
    const raw = await storageService.getItem(READ_KEY);
    let ids: string[] = [];
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) ids = parsed.filter((x): x is string => typeof x === 'string');
      } catch {
        ids = [];
      }
    }
    set({ readIds: ids, hydrated: true });
  },

  markAsRead: async (id) => {
    if (get().readIds.includes(id)) return;
    const next = [...get().readIds, id];
    set({ readIds: next });
    await persist(next);
  },

  markAsUnread: async (id) => {
    if (!get().readIds.includes(id)) return;
    const next = get().readIds.filter((x) => x !== id);
    set({ readIds: next });
    await persist(next);
  },

  isRead: (id) => get().readIds.includes(id),
}));
