/**
 * Dados mockados da aba Faturas (etapa sem integração com API).
 * Reflete o protótipo aprovado: faturas "processadas" com valor da conta,
 * economia e detalhes de consumo.
 */
export interface Fatura {
  id: string;
  month: string;
  amount: string;
  savings: string;
  // Detalhes
  unit: string;
  installation: string;
  distributor: string;
  dueDate: string;
  energyUsed: string;
  cleanEnergyUsed: string;
  storedCredits: string;
}

export const mockFaturas: Fatura[] = [
  {
    id: 'jun-2026',
    month: 'Junho 2026',
    amount: 'R$ 243,90',
    savings: 'R$ 187,40',
    unit: 'Casa - João Lucas',
    installation: '0098 4451 23',
    distributor: 'Energisa',
    dueDate: '10/07/2026',
    energyUsed: '412 kWh',
    cleanEnergyUsed: '430 kWh',
    storedCredits: '18 kWh',
  },
  {
    id: 'mai-2026',
    month: 'Maio 2026',
    amount: 'R$ 251,30',
    savings: 'R$ 176,10',
    unit: 'Casa - João Lucas',
    installation: '0098 4451 23',
    distributor: 'Energisa',
    dueDate: '10/06/2026',
    energyUsed: '428 kWh',
    cleanEnergyUsed: '445 kWh',
    storedCredits: '17 kWh',
  },
  {
    id: 'abr-2026',
    month: 'Abril 2026',
    amount: 'R$ 238,70',
    savings: 'R$ 169,90',
    unit: 'Casa - João Lucas',
    installation: '0098 4451 23',
    distributor: 'Energisa',
    dueDate: '10/05/2026',
    energyUsed: '401 kWh',
    cleanEnergyUsed: '420 kWh',
    storedCredits: '19 kWh',
  },
];

export function getFaturaById(id?: string): Fatura {
  return mockFaturas.find((f) => f.id === id) ?? mockFaturas[0];
}
