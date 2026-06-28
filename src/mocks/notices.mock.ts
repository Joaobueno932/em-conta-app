import { Notice } from '@/types/notice';

// Avisos de vencimento próximo (due_soon) são derivados das faturas no noticeService.
// Aqui ficam apenas cobranças, recados, comunicados e manutenções.
export const mockNotices: Notice[] = [
  {
    id: 'n1',
    unitId: 'u1',
    title: 'Cobrança em aberto',
    message: 'Você tem uma fatura em aberto. Pague para evitar juros e mantenha sua conta em dia.',
    type: 'charge',
    createdAt: '2026-06-20T09:00:00',
    read: false,
    invoiceId: 'inv1',
  },
  {
    id: 'n2',
    unitId: 'u1',
    title: 'Recado importante',
    message: 'Obrigado por economizar com energia renovável! Continue acompanhando sua economia pelo app.',
    type: 'message',
    createdAt: '2026-06-15T14:30:00',
    read: true,
  },
  {
    id: 'n3',
    unitId: 'u1',
    title: 'Manutenção programada',
    message: 'Faremos uma manutenção no dia 15. O app pode ficar indisponível por alguns minutos.',
    type: 'maintenance',
    createdAt: '2026-06-12T08:00:00',
    read: true,
  },
  {
    id: 'n4',
    unitId: 'u2',
    title: 'Cobrança em aberto',
    message: 'Há uma fatura vencida para o seu comércio. Regularize o quanto antes para evitar juros.',
    type: 'charge',
    createdAt: '2026-06-18T10:15:00',
    read: false,
    invoiceId: 'inv4',
  },
  {
    id: 'n5',
    unitId: 'u2',
    title: 'Comunicado',
    message: 'Atualizamos nossos canais de atendimento. Agora você pode falar com a gente direto pelo app.',
    type: 'general',
    createdAt: '2026-06-14T16:45:00',
    read: true,
  },
  {
    id: 'n6',
    unitId: 'u2',
    title: 'Recado importante',
    message: 'Seu comércio está entre os que mais economizaram este mês. Parabéns!',
    type: 'message',
    createdAt: '2026-06-10T11:00:00',
    read: true,
  },
];
