import { dataProvider } from '../data';
import { createClientRequestId } from '../data/providers/shared';

const normalizeRequestPayload = (data = {}) => {
  const items = Array.isArray(data.items)
    ? data.items.map((item) => ({
        materialId: item.material_id ?? item.materialId,
        cantidad: Number(item.cantidad ?? item.quantity ?? 0),
        medidaEtiqueta: item.medida_etiqueta ?? item.measureTag ?? item.labelSize ?? null,
        medidaCustom: item.medida_custom ?? item.measureCustom ?? item.customSize ?? null,
        observaciones: item.observaciones ?? item.notes ?? null,
      }))
    : [];

  return {
    clientRequestId: data.client_request_id ?? data.clientRequestId ?? createClientRequestId(),
    regionId: data.region_id ?? data.regionId ?? null,
    subterritorioId: data.subterritorio_id ?? data.subterritoryId ?? null,
    pdvId: data.pdv_id ?? data.pdvId ?? null,
    canalId: data.canal_id ?? data.canalId ?? data.channelId ?? null,
    campaniaId: data.campania_id ?? data.campaña_id ?? data.campaignId ?? null,
    prioridad: Number(data.prioridad ?? data.priority ?? 0),
    zonas: data.zonas ?? data.zones ?? [],
    observaciones: data.observaciones ?? data.notes ?? '',
    items,
  };
};

export async function createRequest(data) {
  const payload = normalizeRequestPayload(data);
  if (!payload.pdvId) {
    throw new Error('pdv_id es requerido');
  }
  if (!payload.canalId) {
    throw new Error('canal_id es requerido');
  }
  if (!payload.items.length) {
    throw new Error('Debe enviar al menos un item');
  }
  return dataProvider.requests.createSolicitud(payload);
}

export async function listRequests({ limit = 10, offset = 0, filters = {} } = {}) {
  return dataProvider.requests.listSolicitudes({
    ...filters,
    campania_id: filters.campania_id ?? filters['campaña_id'] ?? null,
    limit,
    offset,
  });
}

export async function getRequest(id) {
  return dataProvider.requests.getSolicitudDetalle(id);
}

