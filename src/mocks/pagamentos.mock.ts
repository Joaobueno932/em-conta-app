/**
 * Dados mockados da aba Pagamentos (etapa sem integração com API).
 * Reflete o protótipo aprovado: cobrança atual + histórico de pagamentos.
 */

/** Código Pix "copia e cola" mockado, usado na cobrança atual e no detalhe. */
export const MOCK_PIX_CODE =
  '00020126580014BR.GOV.BCB.PIX0136em-conta-pix-key@emconta.com.br5204000053039865802BR5925Em Conta Energia Renovavel6009SAO PAULO62090510INV16304';

export interface CurrentCharge {
  id: string;
  month: string;
  amount: string;
  dueDate: string;
  statusLabel: string;
  unit: string;
  pixCode: string;
}

export interface PaymentHistoryItem {
  id: string;
  month: string;
  amount: string;
  paidText: string;
  statusLabel: string;
}

export const currentCharge: CurrentCharge = {
  id: 'jun-2026',
  month: 'Junho 2026',
  amount: 'R$ 243,90',
  dueDate: '30/06/2026',
  statusLabel: 'Aguardando pagamento',
  unit: 'Casa - João Lucas',
  pixCode: MOCK_PIX_CODE,
};

export const paymentHistory: PaymentHistoryItem[] = [
  {
    id: 'mai-2026',
    month: 'Maio 2026',
    amount: 'R$ 251,30',
    paidText: 'Pago em 03/05/2026',
    statusLabel: 'Pago',
  },
  {
    id: 'abr-2026',
    month: 'Abril 2026',
    amount: 'R$ 238,70',
    paidText: 'Pago em 05/04/2026',
    statusLabel: 'Pago',
  },
];
