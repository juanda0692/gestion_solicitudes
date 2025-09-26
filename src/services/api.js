// URL base para la API real. Si no está configurada, se utilizarán
// los datos almacenados en LocalStorage (modo demo).
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

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export async function http(path, options = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REACT_APP_API_KEY || process.env.VALID_API_KEYS,
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text(); 

  if (!res.ok) {
    let errBody;
    try { errBody = JSON.parse(text); } catch { errBody = text || ''; }
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    err.body = errBody;
    throw err;
  }

  if (res.status === 204 || text.trim() === '') return null;
  try { return JSON.parse(text); } catch {
    return text;
  }
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
    return http(`/channel-materials?channel_id=${encodeURIComponent(channelId)}`);
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
