import { create } from 'zustand';
import { Unit } from '@/types/unit';
import { unitService } from '@/services/unitService';
import { storageService } from '@/services/storageService';

const SELECTED_UNIT_KEY = 'selected_unit_id';

interface UnitStore {
  units: Unit[];
  selectedUnit: Unit | null;
  selectedUnitId: string | null;
  loading: boolean;
  hydrated: boolean;
  /** Carrega as unidades e restaura a unidade ativa salva (ou usa a primeira como padrão). */
  loadUnits: () => Promise<void>;
  /** Define a unidade ativa e persiste a escolha entre sessões. */
  setSelectedUnit: (unitId: string) => Promise<void>;
}

export const useUnitStore = create<UnitStore>((set, get) => ({
  units: [],
  selectedUnit: null,
  selectedUnitId: null,
  loading: false,
  hydrated: false,

  loadUnits: async () => {
    set({ loading: true });
    const [units, storedId] = await Promise.all([
      unitService.getAll(),
      storageService.getItem(SELECTED_UNIT_KEY),
    ]);

    const current = get().selectedUnitId ?? storedId;
    const selected = units.find((u) => u.id === current) ?? units[0] ?? null;

    set({
      units,
      selectedUnit: selected,
      selectedUnitId: selected?.id ?? null,
      loading: false,
      hydrated: true,
    });
  },

  setSelectedUnit: async (unitId) => {
    const unit = get().units.find((u) => u.id === unitId);
    if (!unit) return;

    set({ selectedUnit: unit, selectedUnitId: unit.id });
    await storageService.setItem(SELECTED_UNIT_KEY, unit.id);
  },
}));
