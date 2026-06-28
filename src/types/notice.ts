export type NoticeType = 'info' | 'warning' | 'success' | 'alert';

export interface Notice {
  id: string;
  unitId: string;
  title: string;
  body: string;
  type: NoticeType;
  createdAt: string;
  read: boolean;
  link?: string;
}
