import { Notice } from '@/types/notice';

export const mockNotices: Notice[] = [
  {
    id: 'n1',
    title: 'Fatura próxima do vencimento',
    body: 'Sua fatura de junho vence em 5 dias. Evite juros e pague agora.',
    type: 'warning',
    createdAt: '2026-07-05T10:00:00',
    read: false,
  },
  {
    id: 'n2',
    title: 'Pagamento confirmado!',
    body: 'Recebemos o pagamento da fatura de maio. Obrigado!',
    type: 'success',
    createdAt: '2026-06-11T14:30:00',
    read: true,
  },
  {
    id: 'n3',
    title: 'Nova fatura disponível',
    body: 'A fatura de junho já está disponível. Confira os detalhes.',
    type: 'info',
    createdAt: '2026-07-01T09:00:00',
    read: false,
  },
  {
    id: 'n4',
    title: 'Manutenção programada',
    body: 'Realizaremos manutenção no sistema no dia 15/07. O app pode ficar indisponível por alguns minutos.',
    type: 'alert',
    createdAt: '2026-07-03T08:00:00',
    read: true,
  },
];
