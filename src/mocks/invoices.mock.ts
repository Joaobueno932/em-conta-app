import { Invoice } from '@/types/invoice';

/** Formata uma data para o padrão ISO local (YYYY-MM-DD) usado pelas faturas. */
function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Retorna a data (ISO) daqui a `days` dias a partir de hoje. */
function addDaysToToday(days: number): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return formatDateToISO(date);
}

export const mockInvoices: Invoice[] = [
  {
    id: 'inv1',
    unitId: 'u1',
    unitName: 'Residência Principal',
    referenceMonth: '2026-07',
    dueDate: addDaysToToday(4),
    amount: 187.5,
    status: 'pending',
    consumption: 320,
    savings: 42.3,
  },
  {
    id: 'inv6',
    unitId: 'u2',
    unitName: 'Comércio',
    referenceMonth: '2026-07',
    dueDate: addDaysToToday(2),
    amount: 203.4,
    status: 'upcoming',
    consumption: 350,
    savings: 46.8,
  },
  {
    id: 'inv4',
    unitId: 'u2',
    unitName: 'Comércio',
    referenceMonth: '2026-06',
    dueDate: '2026-06-05',
    amount: 512.0,
    status: 'overdue',
    consumption: 850,
    savings: 115.6,
  },
  {
    id: 'inv2',
    unitId: 'u1',
    unitName: 'Residência Principal',
    referenceMonth: '2026-06',
    dueDate: '2026-06-10',
    amount: 172.0,
    status: 'paid',
    consumption: 298,
    savings: 38.9,
  },
  {
    id: 'inv3',
    unitId: 'u1',
    unitName: 'Residência Principal',
    referenceMonth: '2026-05',
    dueDate: '2026-05-10',
    amount: 195.8,
    status: 'paid',
    consumption: 340,
    savings: 44.1,
  },
  {
    id: 'inv5',
    unitId: 'u2',
    unitName: 'Comércio',
    referenceMonth: '2026-05',
    dueDate: '2026-05-05',
    amount: 489.3,
    status: 'paid',
    consumption: 810,
    savings: 110.2,
  },
];
