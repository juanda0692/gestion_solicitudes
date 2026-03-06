import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders, isAllowedOrigin } from '../_shared/cors.js';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const N8N_EXPORT_WEBHOOK_URL = Deno.env.get('N8N_EXPORT_WEBHOOK_URL') || '';
const N8N_INTERNAL_TOKEN = Deno.env.get('N8N_INTERNAL_TOKEN') || '';

const rateBucket = new Map();

const json = (request, body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...getCorsHeaders(request.headers.get('origin') || ''),
      'Content-Type': 'application/json',
    },
  });

const applyRateLimit = (key) => {
  const now = Date.now();
  const current = rateBucket.get(key);
  if (!current || now - current.ts > 60_000) {
    rateBucket.set(key, { count: 1, ts: now });
    return;
  }
  if (current.count >= 5) {
    throw new Error('rate_limited');
  }
  current.count += 1;
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    const origin = request.headers.get('origin') || '';
    if (!isAllowedOrigin(origin)) {
      return json(request, { error: 'origin_not_allowed' }, 403);
    }
    return new Response('ok', { headers: getCorsHeaders(origin) });
  }

  try {
    const origin = request.headers.get('origin') || '';
    if (origin && !isAllowedOrigin(origin)) {
      return json(request, { error: 'origin_not_allowed' }, 403);
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !N8N_EXPORT_WEBHOOK_URL || !N8N_INTERNAL_TOKEN) {
      return json(request, { error: 'missing_env' }, 500);
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return json(request, { error: 'missing_token' }, 401);
    }

    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: authHeader } },
    });

    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError || !userData.user) {
      return json(request, { error: 'invalid_session' }, 401);
    }

    applyRateLimit(userData.user.id);

    const payload = await request.json();
    const filters = {
      canal_id: payload?.canal_id || null,
      region_id: payload?.region_id || null,
      subterritorio_id: payload?.subterritorio_id || null,
      pdv_id: payload?.pdv_id || null,
      campania_id: payload?.campania_id || null,
      status: payload?.status || null,
      pdvIds: Array.isArray(payload?.pdvIds) ? payload.pdvIds : [],
      fileName: payload?.fileName || `solicitudes_${new Date().toISOString().slice(0, 10)}.xlsx`,
    };

    const { data: profile } = await client.from('profiles').select('tenant_id').eq('id', userData.user.id).single();
    if (!profile?.tenant_id) {
      return json(request, { error: 'tenant_not_found' }, 403);
    }

    const { data: job, error: jobError } = await client
      .from('export_jobs')
      .insert({
        tenant_id: profile.tenant_id,
        requested_by: userData.user.id,
        status: 'pending',
        filters,
        file_name: filters.fileName,
      })
      .select('id, status, file_name')
      .single();

    if (jobError || !job) {
      return json(request, { error: 'job_insert_failed', details: jobError?.message }, 500);
    }

    const n8nResponse = await fetch(N8N_EXPORT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-token': N8N_INTERNAL_TOKEN,
      },
      body: JSON.stringify({
        exportJobId: job.id,
        userId: userData.user.id,
        tenantId: profile.tenant_id,
        filters,
      }),
    });

    if (!n8nResponse.ok) {
      await client.from('export_jobs').update({ status: 'failed', error_message: `n8n ${n8nResponse.status}` }).eq('id', job.id);
      return json(request, { error: 'n8n_error' }, 502);
    }

    return json(request, {
      jobId: job.id,
      status: 'pending',
      fileName: job.file_name,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'rate_limited') {
      return json(request, { error: 'rate_limited' }, 429);
    }
    return json(
      request,
      { error: 'unexpected_error', message: error instanceof Error ? error.message : 'unknown' },
      500,
    );
  }
});
