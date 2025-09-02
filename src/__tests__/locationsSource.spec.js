import { getActiveLocations } from '../utils/locationsSource';
import { pdvsForSub } from '../utils/locationSelectors';

describe('locations dataset', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('only exposes Sur, Andina, Bogota y Costa', () => {
    const { regions, subterritories, pdvs } = getActiveLocations();

    const names = regions.map((r) => r.name).sort();
    expect(names).toEqual(['Andina', 'Bogota', 'Costa', 'Sur']);

    // IDs de subterritorios únicos
    const subIds = Object.values(subterritories).flat().map((s) => s.id);
    expect(new Set(subIds).size).toBe(subIds.length);

    // IDs de PDVs únicos
    const pdvIds = Object.values(pdvs).flat().map((p) => p.id);
    expect(new Set(pdvIds).size).toBe(pdvIds.length);

    // Selector de PDVs carga jerarquía usando IDs estáticos
    const surPdvs = pdvsForSub('sub-sur-1');
    const surPdvIds = surPdvs.map((p) => p.id);
    expect(surPdvIds).toContain('pdv-s1-001');
  });
});

