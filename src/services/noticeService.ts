import { Notice } from '@/types/notice';
import { mockNotices } from '@/mocks/notices.mock';

export const noticeService = {
  async getAll(): Promise<Notice[]> {
    await new Promise((res) => setTimeout(res, 600));
    return mockNotices;
  },

  async getById(id: string): Promise<Notice> {
    await new Promise((res) => setTimeout(res, 300));
    const notice = mockNotices.find((n) => n.id === id);
    if (!notice) throw new Error('Aviso não encontrado.');
    return notice;
  },

  async getByUnitId(unitId: string): Promise<Notice[]> {
    await new Promise((res) => setTimeout(res, 400));
    return mockNotices.filter((n) => n.unitId === unitId);
  },

  async markAsRead(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 300));
    const notice = mockNotices.find((n) => n.id === id);
    if (notice) notice.read = true;
  },
};
