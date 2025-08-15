import { getActiveLocations } from '../utils/locationsSource';
import { pdvsForSub } from '../utils/locationSelectors';

describe('locations dataset', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('includes Centro region and exposes full hierarchy', () => {
    const { regions, subterritories, pdvs } = getActiveLocations();

    // Región Centro incluida explícitamente
    const regionIds = regions.map((r) => r.id);
    expect(regionIds).toContain('region-centro');

    // IDs de subterritorios únicos
    const subIds = Object.values(subterritories).flat().map((s) => s.id);
    expect(new Set(subIds).size).toBe(subIds.length);

    // IDs de PDVs únicos
    const pdvIds = Object.values(pdvs).flat().map((p) => p.id);
    expect(new Set(pdvIds).size).toBe(pdvIds.length);

    // Selector de PDVs carga jerarquía usando IDs estáticos
    const centerPdvs = pdvsForSub('sub-centro-1');
    const centerPdvIds = centerPdvs.map((p) => p.id);
    expect(centerPdvIds).toContain('pdv-c1-001');
  });
});

