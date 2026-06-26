import { create } from 'zustand';
import { Unit } from '@/types/unit';

interface UnitStore {
  units: Unit[];
  selectedUnit: Unit | null;
  setUnits: (units: Unit[]) => void;
  selectUnit: (unit: Unit) => void;
}

export const useUnitStore = create<UnitStore>((set) => ({
  units: [],
  selectedUnit: null,
  setUnits: (units) => set({ units, selectedUnit: units[0] ?? null }),
  selectUnit: (unit) => set({ selectedUnit: unit }),
}));
