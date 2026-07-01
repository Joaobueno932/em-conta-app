import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type AvisoType = 'vencimento' | 'cobranca' | 'recado' | 'pagamento';
export type AvisoAction = 'ver-pagamento' | 'pagar-agora' | 'ler-recado';

// Azul dos recados (não faz parte da paleta principal, exclusivo desta feature).
const BLUE = '#2F80ED';
const BLUE_BG = '#E8F1FD';

export interface Aviso {
  id: string;
  type: AvisoType;
  title: string;
  description: string;
  datetime: string;
  icon: IconName;
  iconColor: string;
  iconBg: string;
  actionLabel?: string;
  action?: AvisoAction;
  /** Exibe a bolinha vermelha de "não lido" por padrão. */
  unreadByDefault: boolean;
}

export const mockAvisos: Aviso[] = [
  {
    id: 'aviso-1',
    type: 'vencimento',
    title: 'Vencimento próximo',
    description: 'Sua cobrança de Junho vence em 5 dias.',
    datetime: 'Hoje, 09:12',
    icon: 'calendar-outline',
    iconColor: colors.orange,
    iconBg: colors.orangeBg,
    actionLabel: 'Ver pagamento',
    action: 'ver-pagamento',
    unreadByDefault: false,
  },
  {
    id: 'aviso-2',
    type: 'cobranca',
    title: 'Cobrança disponível',
    description: 'Sua nova cobrança já está disponível.',
    datetime: 'Ontem, 18:40',
    icon: 'card-outline',
    iconColor: colors.primary,
    iconBg: colors.greenBg,
    actionLabel: 'Pagar agora',
    action: 'pagar-agora',
    unreadByDefault: true,
  },
  {
    id: 'aviso-3',
    type: 'recado',
    title: 'Recado importante',
    description: 'Temos um recado importante sobre sua unidade consumidora.',
    datetime: '2 dias atrás',
    icon: 'chatbubble-ellipses-outline',
    iconColor: BLUE,
    iconBg: BLUE_BG,
    actionLabel: 'Ler recado',
    action: 'ler-recado',
    unreadByDefault: true,
  },
  {
    id: 'aviso-4',
    type: 'pagamento',
    title: 'Pagamento confirmado',
    description: 'Recebemos o pagamento da sua cobrança de Maio. Obrigado!',
    datetime: 'Maio, 03/05',
    icon: 'checkmark-circle-outline',
    iconColor: colors.primary,
    iconBg: colors.greenBg,
    unreadByDefault: false,
  },
  {
    id: 'aviso-5',
    type: 'recado',
    title: 'Bem-vinda ao Em Conta',
    description: 'Sua unidade já está gerando economia com energia limpa.',
    datetime: 'Abril, 12/04',
    icon: 'chatbubble-ellipses-outline',
    iconColor: BLUE,
    iconBg: BLUE_BG,
    unreadByDefault: false,
  },
];

/** IDs considerados lidos no estado inicial (avisos sem bolinha vermelha). */
export const defaultReadAvisoIds: string[] = mockAvisos
  .filter((a) => !a.unreadByDefault)
  .map((a) => a.id);

/** Texto completo do recado exibido no bottom sheet. */
export const RECADO_MESSAGE =
  'Prezado(a) João Lucas, informamos que sua unidade consumidora foi migrada com sucesso para o novo sistema de monitoramento de energia renovável. A partir deste ciclo, toda a sua compensação de energia solar será contabilizada automaticamente. Qualquer dúvida, fale com nosso suporte.';

export const RECADO_ICON_COLOR = BLUE;
export const RECADO_ICON_BG = BLUE_BG;

export const avisoFilters: { key: AvisoType | 'todos'; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'vencimento', label: 'Vencimentos' },
  { key: 'cobranca', label: 'Cobranças' },
  { key: 'recado', label: 'Recados' },
];
