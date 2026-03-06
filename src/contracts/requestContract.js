const CAMPAIGN_ID_KEYS = [
  'campania_id',
  'campaniaId',
  'campaignId',
  'campa\u00f1a_id',
  'campa\u00c3\u00b1a_id',
];

const pickFirstDefined = (source = {}, keys = []) => {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined && value !== null && value !== '') {
      return value;
    }
  }
  return null;
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeItem = (item = {}) => ({
  materialId: item.material_id ?? item.materialId ?? null,
  cantidad: toNumber(item.cantidad ?? item.quantity ?? 0, 0),
  medidaEtiqueta: item.medida_etiqueta ?? item.measureTag ?? item.labelSize ?? null,
  medidaCustom: item.medida_custom ?? item.measureCustom ?? item.customSize ?? null,
  observaciones: item.observaciones ?? item.notes ?? null,
});

export const normalizeRequestPayload = (data = {}, options = {}) => {
  const items = Array.isArray(data.items) ? data.items.map(normalizeItem) : [];
  const fallbackClientRequestId = options.fallbackClientRequestId || null;

  return {
    clientRequestId: data.client_request_id ?? data.clientRequestId ?? fallbackClientRequestId,
    regionId: data.region_id ?? data.regionId ?? null,
    subterritorioId: data.subterritorio_id ?? data.subterritoryId ?? null,
    pdvId: data.pdv_id ?? data.pdvId ?? null,
    canalId: data.canal_id ?? data.canalId ?? data.channelId ?? null,
    campaniaId: pickFirstDefined(data, CAMPAIGN_ID_KEYS),
    prioridad: toNumber(data.prioridad ?? data.priority ?? 0, 0),
    zonas: Array.isArray(data.zonas ?? data.zones) ? (data.zonas ?? data.zones) : [],
    observaciones: data.observaciones ?? data.notes ?? '',
    items,
  };
};

export const normalizeRequestFilters = (filters = {}) => {
  const normalized = {
    ...filters,
    campania_id: pickFirstDefined(filters, CAMPAIGN_ID_KEYS),
  };

  CAMPAIGN_ID_KEYS.filter((key) => key !== 'campania_id').forEach((legacyKey) => {
    delete normalized[legacyKey];
  });

  return normalized;
};
