import { normalizeRequestFilters, normalizeRequestPayload } from '../contracts/requestContract';

describe('requestContract', () => {
  test('normaliza payload con campania_id canonico', () => {
    const payload = normalizeRequestPayload({
      pdv_id: 'pdv-001',
      canal_id: 'canal-001',
      campania_id: 'camp-123',
      items: [
        {
          material_id: 'mat-01',
          cantidad: '2',
          medida_etiqueta: '10x10',
        },
      ],
    });

    expect(payload.campaniaId).toBe('camp-123');
    expect(payload.items).toEqual([
      {
        materialId: 'mat-01',
        cantidad: 2,
        medidaEtiqueta: '10x10',
        medidaCustom: null,
        observaciones: null,
      },
    ]);
  });

  test('acepta aliases legacy de campania_id', () => {
    const fromUnicodeAlias = normalizeRequestPayload({
      'campa\u00f1a_id': 'camp-legacy-a',
      items: [],
    });
    const fromMojibakeAlias = normalizeRequestPayload({
      'campa\u00c3\u00b1a_id': 'camp-legacy-b',
      items: [],
    });

    expect(fromUnicodeAlias.campaniaId).toBe('camp-legacy-a');
    expect(fromMojibakeAlias.campaniaId).toBe('camp-legacy-b');
  });

  test('normaliza filtros con campania_id canonico', () => {
    const normalized = normalizeRequestFilters({
      status: 'submitted',
      'campa\u00f1a_id': 'camp-001',
    });

    expect(normalized).toEqual({
      status: 'submitted',
      campania_id: 'camp-001',
    });
  });
});
