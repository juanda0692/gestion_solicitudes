const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

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

// Catálogos
export const getRegions = () => http('/regions');
export const getSubterritories = (regionId) => http(`/regions/${encodeURIComponent(regionId)}/subterritories`);
export const getPdvsBySub = (subId) => http(`/subterritories/${encodeURIComponent(subId)}/pdvs`);
export const getChannels = () => http('/channels');
export const getMaterials = () => http('/materials');
export const getMaterialsByChannel = (channelId) => http(`/channels/${encodeURIComponent(channelId)}/materials`);
export const getCampaigns = () => http('/campaigns');

// Solicitudes
export const createRequest = (payload) => http('/requests', { method: 'POST', body: JSON.stringify(payload) });
