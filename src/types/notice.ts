export type NoticeType = 'due_soon' | 'charge' | 'message' | 'maintenance' | 'general';

export interface Notice {
  id: string;
  unitId: string;
  title: string;
  message: string;
  type: NoticeType;
  createdAt: string;
  read: boolean;
  /** Presente quando o aviso está relacionado a uma fatura. */
  invoiceId?: string;
}
