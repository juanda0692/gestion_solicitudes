import { dataProvider } from '../data';
import { createClientRequestId } from '../data/providers/shared';
import { normalizeRequestFilters, normalizeRequestPayload } from '../contracts/requestContract';

export async function createRequest(data) {
  const payload = normalizeRequestPayload(data, {
    fallbackClientRequestId: createClientRequestId(),
  });

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
  const normalizedFilters = normalizeRequestFilters(filters);
  return dataProvider.requests.listSolicitudes({
    ...normalizedFilters,
    limit,
    offset,
  });
}

export async function getRequest(id) {
  return dataProvider.requests.getSolicitudDetalle(id);
}
