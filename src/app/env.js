const readEnv = (key, fallback = '') => {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : fallback;
};

export const DATA_PROVIDER = readEnv('REACT_APP_DATA_PROVIDER', 'fake').toLowerCase();
export const ENABLE_DEMO_AUTH = readEnv('REACT_APP_ENABLE_DEMO_AUTH', 'true') !== 'false';
export const SUPABASE_URL = readEnv('REACT_APP_SUPABASE_URL');
export const SUPABASE_ANON_KEY = readEnv('REACT_APP_SUPABASE_ANON_KEY');
export const EXPORT_MODE = readEnv('REACT_APP_EXPORT_MODE', DATA_PROVIDER === 'supabase' ? 'gateway' : 'fake').toLowerCase();
export const APP_ENV = readEnv('REACT_APP_APP_ENV', process.env.NODE_ENV || 'development');

export const isSupabaseMode = DATA_PROVIDER === 'supabase';
export const isFakeMode = !isSupabaseMode;

