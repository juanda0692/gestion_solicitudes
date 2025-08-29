const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API)
  || process.env.REACT_APP_API
  || 'http://localhost:8000/api';

async function http(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${txt}`);
  }
  return res.status === 204 ? null : res.json();
}

// ---------- Catálogos ----------
export const getRegions = () => http('/regions');
export const getSubterritories = (regionId) =>
  regionId ? http(`/subterritories?region_id=${encodeURIComponent(regionId)}`) : http('/subterritories');
export const getPdvs = (subId) =>
  subId ? http(`/pdvs?subterritorio_id=${encodeURIComponent(subId)}`) : http('/pdvs');
export const getChannels = () => http('/channels');
export const getMaterials = () => http('/materials');
export const getMaterialsByChannel = (channelId) => http(`/channels/${encodeURIComponent(channelId)}/materials`);
export const getCampaigns = () => http('/campaigns');

// ---------- Solicitudes ----------
export const createRequest = (payload) => http('/requests', { method: 'POST', body: JSON.stringify(payload) });
export const getRequest = (id) => http(`/requests/${id}`);
export async function listRequests({ limit = 10, offset = 0, filters = {} } = {}) {
  const params = new URLSearchParams();
  params.set('limit', String(limit));
  params.set('offset', String(offset));
  if (filters.region_id) params.set('region_id', filters.region_id);
  if (filters.subterritorio_id) params.set('subterritorio_id', filters.subterritorio_id);
  if (filters.pdv_id) params.set('pdv_id', filters.pdv_id);
  if (filters['campaña_id']) params.set('campaña_id', filters['campaña_id']);
  return http(`/requests?${params.toString()}`);
}
