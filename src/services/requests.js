const API = 'http://localhost:8000/api';

async function http(method, url, body) {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch (_) {}
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export function createRequest(payload) {
  return http('POST', '/requests', payload);        // -> { id }
}
export function getRequest(id) {
  return http('GET', `/requests/${id}`);            // -> { id, header, items }
}
export async function listRequests({ limit = 10, offset = 0, filters = {} } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  if (filters.region_id) params.set('region_id', filters.region_id);
  if (filters.subterritorio_id) params.set('subterritorio_id', filters.subterritorio_id);
  if (filters.pdv_id) params.set('pdv_id', filters.pdv_id);
  if (filters['campaña_id']) params.set('campaña_id', filters['campaña_id']); // ojo ñ
  return http('GET', `/requests?${params.toString()}`);
}

// Catálogo para filtros (si no existen en otro servicio)
export const getRegions        = () => http('GET', '/regions');
export const getSubterritories = (regionId) =>
  regionId ? http('GET', `/subterritories?region_id=${encodeURIComponent(regionId)}`) : http('GET','/subterritories');
export const getPdvsBySub = (subId) =>
  http('GET', `/subterritories/${encodeURIComponent(subId)}/pdvs`);
export const getCampaigns     = () => http('GET', '/campaigns');

