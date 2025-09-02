// URL base para la API real. Si no está configurada, se utilizarán
// los datos almacenados en LocalStorage (modo demo).
const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API) ||
  process.env.REACT_APP_API ||
  '';

import { getStorageItem, setStorageItem } from '../utils/storage';
import {
  regions as mockRegions,
  subterritories as mockSubterritories,
  pdvs as mockPdvs,
} from '../mock/locationsNormalized';
import { channels as mockChannels } from '../mock/channels';
import { materials as mockMaterials } from '../mock/materials';
import { channelMaterials as mockChannelMaterials } from '../mock/channelMaterials';
import { campaigns as mockCampaigns } from '../mock/campaigns';

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

// Helper para obtener/sembrar valores en LocalStorage
const seed = (key, mock) => {
  const current = getStorageItem(key);
  if (current != null) return current;
  setStorageItem(key, mock);
  return mock;
};

// ---------- Catálogos ----------
export const getRegions = () => {
  if (API_BASE) return http('/regions');
  // TODO backend: reemplazar por llamada al API real
  return Promise.resolve(seed('regions', mockRegions));
};

export const getSubterritories = (regionId) => {
  if (API_BASE)
    return regionId
      ? http(`/subterritories?region_id=${encodeURIComponent(regionId)}`)
      : http('/subterritories');
  // TODO backend: reemplazar por llamada al API real
  const subs = seed('subterritories', mockSubterritories);
  return Promise.resolve(regionId ? subs[regionId] || [] : Object.values(subs).flat());
};

export const getPdvs = (subId) => {
  if (API_BASE)
    return subId
      ? http(`/pdvs?subterritorio_id=${encodeURIComponent(subId)}`)
      : http('/pdvs');
  // TODO backend: reemplazar por llamada al API real
  const map = seed('pdvs', mockPdvs);
  return Promise.resolve(subId ? map[subId] || [] : Object.values(map).flat());
};

export const getChannels = () => {
  if (API_BASE) return http('/channels');
  // TODO backend: reemplazar por llamada al API real
  return Promise.resolve(seed('channels', mockChannels));
};

export const getMaterials = () => {
  if (API_BASE) return http('/materials');
  // TODO backend: reemplazar por llamada al API real
  return Promise.resolve(seed('materials', mockMaterials));
};

export const getMaterialsByChannel = (channelId) => {
  if (API_BASE)
    return http(`/channels/${encodeURIComponent(channelId)}/materials`);
  // TODO backend: reemplazar por llamada al API real
  const map = seed('channelMaterials', mockChannelMaterials);
  const mats = seed('materials', mockMaterials);
  const list = map[channelId] || [];
  return Promise.resolve(
    list.map(({ id, stock }) => ({
      ...mats.find((m) => m.id === id),
      stock,
    })),
  );
};

export const getCampaigns = () => {
  if (API_BASE) return http('/campaigns');
  // TODO backend: reemplazar por llamada al API real
  return Promise.resolve(seed('campaigns', mockCampaigns));
};
