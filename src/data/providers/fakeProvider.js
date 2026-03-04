import { bootstrapDemoData } from '../../utils/bootstrapDemoData';
import { getStorageItem, setStorageItem } from '../../utils/storage';
import { materials as mockMaterials } from '../../mock/materials';
import { channelMaterials as mockChannelMaterials } from '../../mock/channelMaterials';
import {
  createClientRequestId,
  DEMO_TENANT,
  DEMO_USER,
  paginateItems,
  readStoredSession,
  requireSession,
  sanitizeSpreadsheetValue,
  STORAGE_KEYS,
  writeStoredSession,
} from './shared';

const safeDate = (value) => new Date(value || Date.now()).toISOString();

const ensureBootstrapped = () => {
  bootstrapDemoData();
  if (!getStorageItem(STORAGE_KEYS.fakeRequests)) {
    setStorageItem(STORAGE_KEYS.fakeRequests, []);
  }
  if (!getStorageItem(STORAGE_KEYS.fakeExports)) {
    setStorageItem(STORAGE_KEYS.fakeExports, []);
  }
  if (!getStorageItem(STORAGE_KEYS.fakeStocks)) {
    const initialStocks = Object.entries(mockChannelMaterials).reduce((acc, [channelId, entries]) => {
      acc[channelId] = entries.reduce((channelAcc, material) => {
        channelAcc[material.id] = material.stock;
        return channelAcc;
      }, {});
      return acc;
    }, {});
    setStorageItem(STORAGE_KEYS.fakeStocks, initialStocks);
  }
};

const getRegions = () => getStorageItem('regions') || [];
const getSubterritoriesMap = () => getStorageItem('subterritories') || {};
const getPdvsMap = () => getStorageItem('pdvs') || {};
const getChannels = () => getStorageItem('channels') || [];
const getCampaigns = () => getStorageItem('campaigns') || [];
const getRequests = () => getStorageItem(STORAGE_KEYS.fakeRequests) || [];
const getStocks = () => getStorageItem(STORAGE_KEYS.fakeStocks) || {};

const setRequests = (requests) => setStorageItem(STORAGE_KEYS.fakeRequests, requests);
const setStocks = (stocks) => setStorageItem(STORAGE_KEYS.fakeStocks, stocks);

const getMaterialCatalog = () => {
  const fallback = getStorageItem('materials') || mockMaterials;
  return fallback.map((material) => ({
    ...material,
    materialId: material.id,
  }));
};

const buildSession = (username) => ({
  accessToken: 'demo-access-token',
  refreshToken: 'demo-refresh-token',
  tenantId: DEMO_TENANT.id,
  user: {
    ...DEMO_USER,
    email: username || DEMO_USER.email,
    displayName: username || DEMO_USER.displayName,
  },
});

const getSession = async () => {
  ensureBootstrapped();
  return readStoredSession(STORAGE_KEYS.demoSession);
};

const signIn = async (input = {}) => {
  ensureBootstrapped();
  const username = String(input.username || input.email || '').trim();
  const password = String(input.password || '').trim();
  if (!username || !password) {
    throw new Error('Usuario y contraseña requeridos');
  }
  const session = buildSession(username);
  writeStoredSession(STORAGE_KEYS.demoSession, session);
  return session;
};

const signOut = async () => {
  writeStoredSession(STORAGE_KEYS.demoSession, null);
};

const getRegiones = async () =>
  getRegions().map((region) => ({
    id: region.id,
    name: region.name,
    tenantId: DEMO_TENANT.id,
  }));

const getSubterritorios = async (regionId) =>
  (getSubterritoriesMap()[regionId] || []).map((subterritory) => ({
    id: subterritory.id,
    regionId,
    name: subterritory.name,
    tenantId: DEMO_TENANT.id,
  }));

const getPdvs = async (subterritorioId, options = {}) => {
  const query = String(options.search || '').toLowerCase();
  const items = (getPdvsMap()[subterritorioId] || [])
    .filter((pdv) => {
      if (!query) return true;
      return String(pdv.name).toLowerCase().includes(query) || String(pdv.id).toLowerCase().includes(query);
    })
    .map((pdv) => ({
      id: pdv.id,
      code: pdv.id,
      name: pdv.name,
      canalId: pdv.canalId || null,
      subterritorioId: pdv.subterritoryId || subterritorioId,
      tenantId: DEMO_TENANT.id,
      metadata: {
        city: pdv.city || '',
        address: pdv.address || '',
        contactName: pdv.contactName || '',
        contactPhone: pdv.contactPhone || '',
      },
    }));
  return paginateItems(items, options);
};

const getCanales = async () =>
  getChannels().map((channel) => ({
    id: channel.id,
    name: channel.name,
    tenantId: DEMO_TENANT.id,
  }));

const getCampanias = async () =>
  getCampaigns().map((campaign) => ({
    id: campaign.id,
    name: campaign.name,
    priority: Number(campaign.priority || campaign.prioridad || 0),
    status: 'active',
    tenantId: DEMO_TENANT.id,
  }));

const getMaterialesPorCanal = async (canalId, options = {}) => {
  const stocks = getStocks()[canalId] || {};
  const materials = getMaterialCatalog();
  const query = String(options.search || '').toLowerCase();
  const items = Object.keys(stocks)
    .map((materialId) => {
      const material = materials.find((entry) => entry.id === materialId);
      if (!material) return null;
      return {
        id: `${canalId}:${materialId}`,
        canalId,
        materialId,
        name: material.name,
        description: material.description || '',
        stock: stocks[materialId],
        medida_estandar: material.medidas?.[0] || '',
        size: material.medidas?.[0] || '',
        unitMeasure: material.unidad_medida || 'unidad',
        measures: material.medidas || [],
        tenantId: DEMO_TENANT.id,
      };
    })
    .filter(Boolean)
    .filter((material) => {
      if (!query) return true;
      return material.name.toLowerCase().includes(query) || material.materialId.toLowerCase().includes(query);
    });
  return paginateItems(items, options);
};

const findMaterialName = (materialId) => {
  const material = getMaterialCatalog().find((entry) => entry.id === materialId);
  return material?.name || materialId;
};

const findNameById = (list, id) => list.find((item) => item.id === id)?.name || id || '-';

const createSolicitud = async (payload) => {
  ensureBootstrapped();
  const session = await getSession();
  requireSession(session);

  const items = Array.isArray(payload.items) ? payload.items : [];
  if (!payload.pdvId || !payload.canalId || items.length === 0) {
    throw new Error('Solicitud incompleta');
  }

  const requests = getRequests();
  const requestId = payload.clientRequestId || createClientRequestId();
  const existing = requests.find((request) => request.client_request_id === requestId);
  if (existing) {
    return {
      requestId: existing.id,
      solicitud_id: existing.id,
      created_at: existing.created_at,
      status: existing.status,
      items: existing.items.length,
      items_count: existing.items.length,
      idempotent_replay: true,
    };
  }

  const stocks = getStocks();
  const channelStock = { ...(stocks[payload.canalId] || {}) };
  items.forEach((item) => {
    const materialId = item.materialId;
    const quantity = Number(item.cantidad || item.quantity || 0);
    if (!materialId || quantity <= 0) {
      throw new Error('Cada item requiere material_id y cantidad valida');
    }
    const available = Number(channelStock[materialId] || 0);
    if (available < quantity) {
      const error = new Error(`Stock insuficiente para ${findMaterialName(materialId)}`);
      error.status = 409;
      throw error;
    }
    channelStock[materialId] = available - quantity;
  });

  const nextId = requests.reduce((maxId, request) => Math.max(maxId, Number(request.id || 0)), 0) + 1;
  const createdAt = safeDate();
  const record = {
    id: nextId,
    tenant_id: DEMO_TENANT.id,
    client_request_id: requestId,
    region_id: payload.regionId || null,
    subterritorio_id: payload.subterritorioId || null,
    pdv_id: payload.pdvId,
    canal_id: payload.canalId,
    campania_id: payload.campaniaId || null,
    status: 'submitted',
    prioridad: payload.prioridad ?? null,
    zonas: payload.zonas || [],
    observaciones: payload.observaciones || '',
    created_by: session.user.id,
    created_at: createdAt,
    updated_at: createdAt,
    items: items.map((item, index) => ({
      id: index + 1,
      tenant_id: DEMO_TENANT.id,
      material_id: item.materialId,
      material_name: findMaterialName(item.materialId),
      cantidad: Number(item.cantidad || item.quantity || 0),
      medida_etiqueta: item.medidaEtiqueta || item.medida_etiqueta || null,
      medida_custom: item.medidaCustom || item.medida_custom || null,
      observaciones: item.observaciones || item.notes || '',
      created_at: createdAt,
    })),
  };

  setRequests([...requests, record]);
  setStocks({ ...stocks, [payload.canalId]: channelStock });

  return {
    requestId: record.id,
    solicitud_id: record.id,
    created_at: record.created_at,
    status: record.status,
    items: record.items.length,
    items_count: record.items.length,
    idempotent_replay: false,
  };
};

const buildRequestRow = (request) => {
  const regions = getRegions();
  const subterritories = Object.values(getSubterritoriesMap()).flat();
  const pdvs = Object.values(getPdvsMap()).flat();
  const channels = getChannels();
  const campaigns = getCampaigns();

  return {
    id: request.id,
    tenant_id: request.tenant_id,
    pdv_id: request.pdv_id,
    pdv_name: findNameById(pdvs, request.pdv_id),
    region_id: request.region_id,
    region_name: findNameById(regions, request.region_id),
    subterritorio_id: request.subterritorio_id,
    subterritorio_name: findNameById(subterritories, request.subterritorio_id),
    canal_id: request.canal_id,
    canal_name: findNameById(channels, request.canal_id),
    campania_id: request.campania_id,
    campania_name: findNameById(campaigns, request.campania_id),
    status: request.status,
    prioridad: request.prioridad,
    items_count: request.items.length,
    created_by: request.created_by,
    created_at: request.created_at,
  };
};

const matchesFilters = (request, filters = {}, session) => {
  if (request.tenant_id !== session.tenantId) return false;
  if (request.created_by !== session.user.id) return false;
  if (filters.region_id && request.region_id !== filters.region_id) return false;
  if (filters.subterritorio_id && request.subterritorio_id !== filters.subterritorio_id) return false;
  if (filters.pdv_id && request.pdv_id !== filters.pdv_id) return false;
  if (filters.campania_id && request.campania_id !== filters.campania_id) return false;
  if (filters.canal_id && request.canal_id !== filters.canal_id) return false;
  if (filters.status && request.status !== filters.status) return false;
  if (Array.isArray(filters.pdvIds) && filters.pdvIds.length > 0 && !filters.pdvIds.includes(request.pdv_id)) return false;
  return true;
};

const listSolicitudes = async (filters = {}) => {
  ensureBootstrapped();
  const session = await getSession();
  requireSession(session);
  const limit = Number(filters.limit || 10);
  const offset = Number(filters.offset || 0);
  const filtered = getRequests()
    .filter((request) => matchesFilters(request, filters, session))
    .sort((left, right) => String(right.created_at).localeCompare(String(left.created_at)));
  const page = filtered.slice(offset, offset + limit).map(buildRequestRow);
  return {
    data: page,
    page: {
      limit,
      offset,
      total: filtered.length,
    },
  };
};

const getSolicitudDetalle = async (id) => {
  ensureBootstrapped();
  const session = await getSession();
  requireSession(session);
  const request = getRequests().find((entry) => String(entry.id) === String(id));
  if (!request || !matchesFilters(request, {}, session)) {
    throw new Error('Solicitud no encontrada');
  }
  return {
    id: request.id,
    header: {
      region_id: request.region_id,
      subterritorio_id: request.subterritorio_id,
      pdv_id: request.pdv_id,
      canal_id: request.canal_id,
      campania_id: request.campania_id,
      prioridad: request.prioridad,
      zonas: request.zonas,
      observaciones: request.observaciones,
      created_by: request.created_by,
      created_at: request.created_at,
      status: request.status,
    },
    items: request.items,
  };
};

const buildExportRows = (requests) =>
  requests.flatMap((request) =>
    request.items.map((item) => ({
      solicitud_id: request.id,
      created_at: request.created_at,
      status: request.status,
      canal_id: request.canal_id,
      canal_name: request.canal_name,
      region_id: request.region_id,
      region_name: request.region_name,
      subterritorio_id: request.subterritorio_id,
      subterritorio_name: request.subterritorio_name,
      pdv_id: request.pdv_id,
      pdv_name: request.pdv_name,
      campania_id: request.campania_id,
      campania_name: request.campania_name,
      prioridad: request.prioridad ?? '',
      created_by: request.created_by,
      created_by_name: request.created_by,
      observaciones: request.observaciones || '',
      item_id: item.id,
      material_id: item.material_id,
      material_name: item.material_name,
      cantidad: item.cantidad,
      medida_etiqueta: sanitizeSpreadsheetValue(item.medida_etiqueta || ''),
      medida_custom: sanitizeSpreadsheetValue(item.medida_custom || ''),
      item_observaciones: sanitizeSpreadsheetValue(item.observaciones || ''),
    })),
  );

const startExport = async (filters = {}) => {
  ensureBootstrapped();
  const session = await getSession();
  requireSession(session);
  const matching = getRequests()
    .filter((request) => matchesFilters(request, filters, session))
    .map((request) => ({
      ...buildRequestRow(request),
      observaciones: request.observaciones,
      items: request.items,
    }));

  if (matching.length === 0) {
    throw new Error('No hay solicitudes para exportar');
  }

  const fileName = filters.fileName || `solicitudes_${new Date().toISOString().slice(0, 10)}.xlsx`;
  return {
    rows: buildExportRows(matching),
    fileName,
  };
};

const getExportJob = async (id) => {
  throw new Error(`Export jobs no estan disponibles en descarga directa: ${id}`);
};

export const fakeProvider = {
  auth: {
    getSession,
    signIn,
    signOut,
  },
  catalogs: {
    getRegiones,
    getSubterritorios,
    getPdvs,
    getCanales,
    getCampanias,
    getMaterialesPorCanal,
  },
  requests: {
    createSolicitud,
    listSolicitudes,
    getSolicitudDetalle,
  },
  exports: {
    startExport,
    getExportJob,
  },
};
