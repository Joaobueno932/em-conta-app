import { Unit } from '@/types/unit';
import { mockUnits } from '@/mocks/units.mock';

export const unitService = {
  async getAll(): Promise<Unit[]> {
    await new Promise((res) => setTimeout(res, 700));
    return mockUnits;
  },

  async getById(id: string): Promise<Unit> {
    await new Promise((res) => setTimeout(res, 400));
    const unit = mockUnits.find((u) => u.id === id);
    if (!unit) throw new Error('Unidade não encontrada.');
    return unit;
  },
};
