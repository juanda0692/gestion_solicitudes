import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../app/env';
import {
  createClientRequestId,
  STORAGE_KEYS,
  writeStoredSession,
  readStoredSession,
  requireSession,
} from './shared';

const assertSupabaseEnv = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Faltan REACT_APP_SUPABASE_URL o REACT_APP_SUPABASE_ANON_KEY');
  }
};

const buildHeaders = (session, extras = {}) => {
  assertSupabaseEnv();
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...extras,
  };
  if (session?.accessToken) {
    headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return headers;
};

const readJson = async (response) => {
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const error = new Error(data?.message || data?.error_description || `HTTP ${response.status}`);
    error.status = response.status;
    error.body = data;
    throw error;
  }
  return data;
};

const isInvalidCredentialsError = (error) => {
  const message = String(error?.message || '').toLowerCase();
  const description = String(error?.body?.error_description || '').toLowerCase();
  const status = Number(error?.status || 0);

  return (
    (status === 400 || status === 401) &&
    (
      message.includes('invalid login credentials') ||
      description.includes('invalid login credentials') ||
      message === 'http 400' ||
      message === 'http 401'
    )
  );
};

const restUrl = (path) => `${SUPABASE_URL}${path}`;

const getSession = async () => readStoredSession(STORAGE_KEYS.supabaseSession);
const clearSession = () => writeStoredSession(STORAGE_KEYS.supabaseSession, null);

const buildUserFromAuth = (authUser = {}, fallbackUser = {}) => ({
  id: authUser?.id || fallbackUser?.id || null,
  email: authUser?.email || fallbackUser?.email || null,
  displayName:
    authUser?.user_metadata?.display_name ||
    fallbackUser?.displayName ||
    authUser?.email ||
    fallbackUser?.email ||
    null,
  appRole: fallbackUser?.appRole || 'requester',
});

const buildSessionFromAuth = (authData = {}, previous = {}) => ({
  accessToken: authData?.access_token || previous?.accessToken || null,
  refreshToken: authData?.refresh_token || previous?.refreshToken || null,
  tenantId: previous?.tenantId || null,
  user: buildUserFromAuth(authData?.user, previous?.user),
});

const fetchAuthUser = async (session) => {
  const response = await fetch(restUrl('/auth/v1/user'), {
    headers: buildHeaders(session),
  });
  return readJson(response);
};

const fetchProfile = async (session, userId) => {
  if (!userId) return null;
  const response = await fetch(
    restUrl(`/rest/v1/profiles?select=tenant_id,display_name,app_role&id=eq.${encodeURIComponent(userId)}`),
    {
      headers: buildHeaders(session),
    },
  );
  const data = await readJson(response);
  return Array.isArray(data) ? data[0] || null : null;
};

const applyProfileToSession = (session, profile = null) => ({
  ...session,
  tenantId: profile?.tenant_id || session?.tenantId || null,
  user: {
    ...(session?.user || {}),
    displayName: profile?.display_name || session?.user?.displayName || session?.user?.email || null,
    appRole: profile?.app_role || session?.user?.appRole || 'requester',
  },
});

const signIn = async (input = {}) => {
  assertSupabaseEnv();
  const email = String(input.email || input.username || '').trim();
  const password = String(input.password || '').trim();
  if (!email || !password) {
    throw new Error('Usuario y contrasena requeridos');
  }

  let authData;
  try {
    const authResponse = await fetch(restUrl('/auth/v1/token?grant_type=password'), {
      method: 'POST',
      headers: buildHeaders(null),
      body: JSON.stringify({ email, password }),
    });
    authData = await readJson(authResponse);
  } catch (error) {
    if (isInvalidCredentialsError(error)) {
      const invalidCredentialsError = new Error('Usuario y/o contrasena incorrectos');
      invalidCredentialsError.status = 401;
      throw invalidCredentialsError;
    }
    throw error;
  }

  const baseSession = buildSessionFromAuth(authData);
  if (!baseSession?.user?.id) {
    throw new Error('No se pudo validar la sesion del usuario');
  }
  const profile = await fetchProfile(baseSession, baseSession.user.id);
  const session = applyProfileToSession(baseSession, profile);

  writeStoredSession(STORAGE_KEYS.supabaseSession, session);
  return session;
};

const validateSession = async () => {
  const storedSession = await getSession();
  if (!storedSession?.accessToken) {
    clearSession();
    return null;
  }

  const validateWithSession = async (sessionCandidate) => {
    const userData = await fetchAuthUser(sessionCandidate);
    const mergedSession = {
      ...sessionCandidate,
      user: buildUserFromAuth(userData?.user, sessionCandidate?.user),
    };
    const profile = await fetchProfile(mergedSession, mergedSession?.user?.id);
    const validSession = applyProfileToSession(mergedSession, profile);
    writeStoredSession(STORAGE_KEYS.supabaseSession, validSession);
    return validSession;
  };

  try {
    return await validateWithSession(storedSession);
  } catch (error) {
    const shouldTryRefresh = Number(error?.status || 0) === 401 && Boolean(storedSession?.refreshToken);
    if (!shouldTryRefresh) {
      clearSession();
      return null;
    }

    try {
      const refreshResponse = await fetch(restUrl('/auth/v1/token?grant_type=refresh_token'), {
        method: 'POST',
        headers: buildHeaders(null),
        body: JSON.stringify({ refresh_token: storedSession.refreshToken }),
      });
      const refreshData = await readJson(refreshResponse);
      const refreshedSession = buildSessionFromAuth(refreshData, storedSession);
      if (!refreshedSession?.accessToken) {
        clearSession();
        return null;
      }
      return await validateWithSession(refreshedSession);
    } catch (_refreshError) {
      clearSession();
      return null;
    }
  }
};

const signOut = async () => {
  const session = await getSession();
  try {
    if (session?.accessToken) {
      await fetch(restUrl('/auth/v1/logout'), {
        method: 'POST',
        headers: buildHeaders(session),
      });
    }
  } finally {
    clearSession();
  }
};

const queryView = async (viewName, search = '') => {
  const session = await getSession();
  requireSession(session);
  const query = search ? `&name=ilike.*${encodeURIComponent(search)}*` : '';
  const response = await fetch(restUrl(`/rest/v1/${viewName}?select=*&order=name.asc${query}`), {
    headers: buildHeaders(session),
  });
  return readJson(response);
};

const getRegiones = async () => queryView('v_regiones');

const getSubterritorios = async (regionId) => {
  const session = await getSession();
  requireSession(session);
  const response = await fetch(
    restUrl(`/rest/v1/v_subterritorios?select=*&region_id=eq.${encodeURIComponent(regionId)}&order=name.asc`),
    { headers: buildHeaders(session) },
  );
  return readJson(response);
};

const getPdvs = async (subterritorioId, options = {}) => {
  const session = await getSession();
  requireSession(session);
  const limit = Number(options.limit || 50);
  const offset = Number(options.offset || 0);
  const search = String(options.search || '').trim();
  const filters = [`subterritorio_id=eq.${encodeURIComponent(subterritorioId)}`];
  if (search) {
    filters.push(`or=(name.ilike.*${encodeURIComponent(search)}*,id.ilike.*${encodeURIComponent(search)}*)`);
  }
  const response = await fetch(
    restUrl(`/rest/v1/v_pdvs?select=*&${filters.join('&')}&order=name.asc&limit=${limit}&offset=${offset}`),
    {
      headers: {
        ...buildHeaders(session),
        Prefer: 'count=exact',
      },
    },
  );
  const data = await readJson(response);
  const total = Number(response.headers.get('content-range')?.split('/')[1] || data.length);
  return { data, total, limit, offset };
};

const getCanales = async () => queryView('v_canales');
const getCampanias = async () => queryView('v_campanias');

const getMaterialesPorCanal = async (canalId, options = {}) => {
  const session = await getSession();
  requireSession(session);
  const limit = Number(options.limit || 50);
  const offset = Number(options.offset || 0);
  const search = String(options.search || '').trim();
  const filters = [`canal_id=eq.${encodeURIComponent(canalId)}`];
  if (search) {
    filters.push(`or=(name.ilike.*${encodeURIComponent(search)}*,material_id.ilike.*${encodeURIComponent(search)}*)`);
  }
  const response = await fetch(
    restUrl(`/rest/v1/v_materiales_por_canal?select=*&${filters.join('&')}&order=name.asc&limit=${limit}&offset=${offset}`),
    {
      headers: {
        ...buildHeaders(session),
        Prefer: 'count=exact',
      },
    },
  );
  const data = await readJson(response);
  const total = Number(response.headers.get('content-range')?.split('/')[1] || data.length);
  return { data, total, limit, offset };
};

const rpc = async (functionName, payload) => {
  const session = await getSession();
  requireSession(session);
  const response = await fetch(restUrl(`/rest/v1/rpc/${functionName}`), {
    method: 'POST',
    headers: buildHeaders(session),
    body: JSON.stringify(payload),
  });
  return readJson(response);
};

const createSolicitud = async (payload) =>
  rpc('rpc_create_request', {
    payload: {
      client_request_id: payload.clientRequestId || createClientRequestId(),
      region_id: payload.regionId || null,
      subterritorio_id: payload.subterritorioId || null,
      pdv_id: payload.pdvId || null,
      canal_id: payload.canalId || null,
      campania_id: payload.campaniaId || null,
      prioridad: payload.prioridad ?? null,
      zonas: Array.isArray(payload.zonas) ? payload.zonas : [],
      observaciones: payload.observaciones || '',
      items: Array.isArray(payload.items)
        ? payload.items.map((item) => ({
            material_id: item.materialId || item.material_id || null,
            cantidad: Number(item.cantidad || 0),
            medida_etiqueta: item.medidaEtiqueta || item.medida_etiqueta || null,
            medida_custom: item.medidaCustom || item.medida_custom || null,
            observaciones: item.observaciones || null,
          }))
        : [],
    },
  });

const listSolicitudes = async (filters = {}) => {
  const session = await getSession();
  requireSession(session);
  const limit = Number(filters.limit || 10);
  const offset = Number(filters.offset || 0);
  const params = ['select=*', `limit=${limit}`, `offset=${offset}`, 'order=created_at.desc'];
  ['region_id', 'subterritorio_id', 'pdv_id', 'canal_id', 'campania_id', 'status'].forEach((key) => {
    if (filters[key]) params.push(`${key}=eq.${encodeURIComponent(filters[key])}`);
  });
  const response = await fetch(restUrl(`/rest/v1/v_solicitudes_list?${params.join('&')}`), {
    headers: {
      ...buildHeaders(session),
      Prefer: 'count=exact',
    },
  });
  const data = await readJson(response);
  const total = Number(response.headers.get('content-range')?.split('/')[1] || data.length);
  return { data, page: { limit, offset, total } };
};

const getSolicitudDetalle = async (id) => rpc('rpc_get_request_detail', { p_request_id: Number(id) });

const startExport = async (filters = {}) => {
  const session = await getSession();
  requireSession(session);
  const response = await fetch(restUrl('/rest/v1/rpc/rpc_export_dataset'), {
    method: 'POST',
    headers: buildHeaders(session),
    body: JSON.stringify({
      filters: {
        canal_id: filters.canal_id || null,
        region_id: filters.region_id || null,
        subterritorio_id: filters.subterritorio_id || null,
        pdv_id: filters.pdv_id || null,
        campania_id: filters.campania_id || null,
        status: filters.status || null,
        pdvIds: Array.isArray(filters.pdvIds) ? filters.pdvIds : [],
      },
    }),
  });
  const rows = await readJson(response);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No hay solicitudes para exportar');
  }
  return {
    rows,
    fileName: filters.fileName || `solicitudes_${new Date().toISOString().slice(0, 10)}.xlsx`,
  };
};

const getExportJob = async (id) => {
  throw new Error(`Export jobs no estan disponibles en descarga directa: ${id}`);
};

export const supabaseProvider = {
  auth: {
    getSession,
    validateSession,
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
