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
