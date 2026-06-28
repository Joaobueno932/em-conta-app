export type UnitStatus = 'active' | 'inactive' | 'pending';

export type UnitType = 'residential' | 'commercial';

export interface Unit {
  id: string;
  name: string;
  address: string;
  number: string;
  city: string;
  state: string;
  type: UnitType;
  status: UnitStatus;
  consumption: number;
  savingsPercent: number;
}
