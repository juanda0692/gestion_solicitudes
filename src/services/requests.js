import { getStorageItem, setStorageItem } from '../utils/storage';
import { http } from './api';

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API)
  || process.env.REACT_APP_API_BASE_URL;
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

function normalizeRequestPayload(data = {}) {
  const toNull = (v) => (v === undefined ? null : v);

  const solicitud = {
    region_id:        toNull(data.region_id ?? data.regionId),
    subterritorio_id: toNull(data.subterritorio_id ?? data.subterritoryId),
    pdv_id:           data.pdv_id ?? data.pdvId,              // 👈 acepta ambos
    campaña_id:       toNull(data.campaña_id ?? data.campaignId),
    prioridad:        data.prioridad ?? data.priority ?? 0,
    zonas:            data.zonas ?? data.zones ?? null,       // json/array/obj
    observaciones:    toNull(data.observaciones ?? data.notes),
    creado_por:       toNull(data.creado_por ?? data.createdBy),
  };

  const items = Array.isArray(data.items) ? data.items.map((it) => ({
    material_id:     it.material_id ?? it.materialId,         // 👈 ambos
    cantidad:        it.cantidad ?? it.quantity ?? 0,
    medida_etiqueta: toNull(it.medida_etiqueta ?? it.labelSize),
    medida_custom:   toNull(it.medida_custom ?? it.customSize),
    observaciones:   toNull(it.observaciones ?? it.notes),
  })) : [];

  return { solicitud, items };
}

export async function createRequest(data) {
  // Normaliza primero
  const { solicitud, items } = normalizeRequestPayload(data);

  // Validación en FE (coherente con n8n)
  const errors = [];
  if (!solicitud.pdv_id) errors.push('pdv_id es requerido');
  if (!Array.isArray(items) || items.length === 0) errors.push('Debe enviar al menos un item');
  if (items.some(it => !it.material_id)) errors.push('Cada item requiere material_id');
  if (items.some(it => typeof it.cantidad !== 'number' || it.cantidad < 0)) errors.push('cantidad debe ser número >= 0');

  if (errors.length) {
    const err = new Error(errors[0]);
    err.status = 400;
    err.body = { error: 'VALIDATION_FAILED', details: errors };
    throw err;
  }

  // Envía al backend usando nombres de columna + items
  const payload = { ...solicitud, items };
  return http('/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
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
