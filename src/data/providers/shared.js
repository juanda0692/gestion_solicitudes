import { getStorageItem, setStorageItem } from '../../utils/storage';

export const STORAGE_KEYS = {
  demoSession: 'app.demo.session',
  fakeRequests: 'app.fake.requests',
  fakeStocks: 'app.fake.materialStocks',
  fakeExports: 'app.fake.exportJobs',
  supabaseSession: 'app.supabase.session',
};

export const DEMO_TENANT = {
  id: '00000000-0000-0000-0000-000000000001',
  code: 'demo',
  name: 'Tenant Demo Tigo',
};

export const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000010',
  email: 'demo@tigo.local',
  displayName: 'Usuario Demo',
  appRole: 'requester',
  tenantId: DEMO_TENANT.id,
};

export const createPageResult = (items, limit = items.length, offset = 0) => ({
  data: items,
  total: items.length,
  limit,
  offset,
});

export const paginateItems = (items, { limit = 50, offset = 0 } = {}) => ({
  data: items.slice(offset, offset + limit),
  total: items.length,
  limit,
  offset,
});

export const normalizeSearch = (value) => String(value || '').trim().toLowerCase();

export const createClientRequestId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `req-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const sanitizeSpreadsheetValue = (value) => {
  if (typeof value !== 'string') return value;
  if (/^[=+\-@]/.test(value)) return `'${value}`;
  return value;
};

export const readStoredSession = (key) => getStorageItem(key);
export const writeStoredSession = (key, value) => setStorageItem(key, value);

export const requireSession = (session, message = 'Debes iniciar sesion') => {
  if (!session || !session.user?.id) {
    const error = new Error(message);
    error.status = 401;
    throw error;
  }
};

