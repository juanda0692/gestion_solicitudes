const parseOrigins = (raw) =>
  String(raw || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const configuredOrigins = parseOrigins(Deno.env.get('EDGE_ALLOWED_ORIGINS'));
if (configuredOrigins.length === 0) {
  configuredOrigins.push(...parseOrigins(Deno.env.get('ALLOWED_ORIGINS')));
}

const defaultLocalOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const allowedOrigins =
  configuredOrigins.length > 0 ? configuredOrigins : defaultLocalOrigins;

export const isAllowedOrigin = (origin) => {
  if (!origin) return false;
  if (allowedOrigins.includes('*')) return true;
  return allowedOrigins.includes(origin);
};

export const getCorsHeaders = (origin) => ({
  ...(isAllowedOrigin(origin)
    ? {
        'Access-Control-Allow-Origin': origin,
        Vary: 'Origin',
      }
    : {}),
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
});
