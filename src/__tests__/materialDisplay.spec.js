import { getDisplayName, formatQuantity } from '../utils/materialDisplay';

describe('materialDisplay helpers', () => {
  test('volantes quantity', () => {
    expect(formatQuantity('volantes', 20)).toBe('20 asesores');
  });

  test('TEND CARD display name', () => {
    expect(getDisplayName('TEND CARD')).toBe('Puesto de asesores (TEND CARD)');
  });

  test('NPS display name', () => {
    expect(getDisplayName('NPS')).toBe('Puesto de asesores (NPS)');
  });
});
