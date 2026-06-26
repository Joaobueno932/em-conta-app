export type UnitStatus = 'active' | 'inactive' | 'pending';

export interface Unit {
  id: string;
  name: string;
  address: string;
  number: string;
  city: string;
  state: string;
  status: UnitStatus;
  consumption: number;
  savingsPercent: number;
}
