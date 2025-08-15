import { pdvs } from '../mock/locations';

describe('PDV IDs', () => {
  test('use slugged identifiers', () => {
    const ids = Object.values(pdvs).flat().map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => !/^pdv-\d/.test(id))).toBe(true);
  });
});
