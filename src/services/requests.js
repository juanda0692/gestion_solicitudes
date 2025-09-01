const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API)
  || process.env.REACT_APP_API;

import { getStorageItem, setStorageItem } from '../utils/storage';

const STORAGE_KEY = 'requests';

export function getRequestsLocal() {
  return getStorageItem(STORAGE_KEY) || [];
}

export function getRequestLocal(id) {
  const all = getRequestsLocal();
  return all.find(r => String(r.id) === String(id)) || null;
}

export function saveRequestLocal(payload) {
  const all = getRequestsLocal();
  const nextId = all.length ? Math.max(...all.map(r => r.id)) + 1 : 1;
  const record = {
    id: nextId,
    header: {
      region_id: payload.regionId,
      subterritorio_id: payload.subterritoryId,
      pdv_id: payload.pdvId,
      campaña_id: payload.campaignId || null,
      prioridad: payload.priority || null,
      zonas: payload.zones || [],
      observaciones: payload.observations || '',
      creado_por: payload.createdBy || '',
      creado_en: new Date().toISOString(),
    },
    items: payload.items.map((item, idx) => ({
      id: idx + 1,
      material_id: item.materialId,
      cantidad: item.quantity,
      medida_etiqueta: item.measureTag,
      medida_custom: item.measureCustom,
      observaciones: item.observations || '',
    })),
  };
  all.push(record);
  setStorageItem(STORAGE_KEY, all);
  return record;
}

export async function createRequest(payload) {
  if (API_BASE) {
    // TODO backend: reemplazar o ajustar llamada a la API real según sea necesario
    const res = await fetch(`${API_BASE}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${txt}`);
    }
    return res.json();
  }
  // TODO backend: utilizar API real en lugar de LocalStorage
  const record = saveRequestLocal(payload);
  return { id: record.id };
}

export async function listRequests({ limit = 10, offset = 0, filters = {} } = {}) {
  if (API_BASE) {
    // TODO backend: reemplazar llamada a la API real si es necesario
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    params.set('offset', String(offset));
    if (filters.region_id) params.set('region_id', filters.region_id);
    if (filters.subterritorio_id) params.set('subterritorio_id', filters.subterritorio_id);
    if (filters.pdv_id) params.set('pdv_id', filters.pdv_id);
    if (filters['campaña_id']) params.set('campaña_id', filters['campaña_id']);
    const res = await fetch(`${API_BASE}/requests?${params.toString()}`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${txt}`);
    }
    return res.json();
  }
  // TODO backend: usar datos del backend real
  const all = getRequestsLocal().filter(r => {
    const h = r.header;
    if (filters.region_id && h.region_id !== filters.region_id) return false;
    if (filters.subterritorio_id && h.subterritorio_id !== filters.subterritorio_id) return false;
    if (filters.pdv_id && h.pdv_id !== filters.pdv_id) return false;
    if (filters['campaña_id'] && h.campaña_id !== filters['campaña_id']) return false;
    return true;
  });
  const slice = all.slice(offset, offset + limit);
  const data = slice.map(r => ({
    id: r.id,
    region_id: r.header.region_id,
    subterritorio_id: r.header.subterritorio_id,
    pdv_id: r.header.pdv_id,
    campaña_id: r.header.campaña_id,
    prioridad: r.header.prioridad,
    items_count: r.items.length,
    creado_por: r.header.creado_por,
    creado_en: r.header.creado_en,
  }));
  return { data, page: { total: all.length } };
}

export async function getRequest(id) {
  if (API_BASE) {
    // TODO backend: reemplazar llamada a la API real si es necesario
    const res = await fetch(`${API_BASE}/requests/${id}`);
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${txt}`);
    }
    return res.json();
  }
  // TODO backend: utilizar API real en lugar de LocalStorage
  const rec = getRequestLocal(id);
  if (!rec) throw new Error('Solicitud no encontrada');
  return rec;
}

