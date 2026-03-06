# Verificacion de Hardening SQL (SECURITY DEFINER)

Este documento valida que la migracion [20260305110000_harden_security_definer.sql](c:/Users/juand/OneDrive/Desktop/tigo_gestion_solicitudes/supabase/migrations/20260305110000_harden_security_definer.sql) quedo aplicada en la base de datos objetivo.

## 1) Aplicar migracion en entorno remoto (CLI)

```bash
supabase link --project-ref <PROJECT_REF>
supabase db push
supabase migration list
```

Si no tienes CLI, aplica la migracion desde SQL Editor en Supabase Dashboard.

## 2) Verificar `search_path` defensivo

Ejecutar en SQL Editor:

```sql
select
  n.nspname as schema_name,
  p.proname as function_name,
  p.proconfig
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in (
    'log_audit_event',
    'rpc_create_request',
    'rpc_get_request_detail',
    'rpc_export_dataset'
  )
order by p.proname;
```

Resultado esperado:
- `proconfig` contiene `search_path=public, pg_temp` para las funciones listadas.

## 3) Verificar privilegios de ejecucion

Ejecutar en SQL Editor:

```sql
with targets as (
  select
    p.oid,
    n.nspname || '.' || p.proname || '(' || pg_get_function_identity_arguments(p.oid) || ')' as fn
  from pg_proc p
  join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public'
    and p.proname in ('log_audit_event', 'rpc_create_request', 'rpc_get_request_detail', 'rpc_export_dataset')
)
select
  fn,
  has_function_privilege('anon', oid, 'EXECUTE') as anon_exec,
  has_function_privilege('authenticated', oid, 'EXECUTE') as authenticated_exec,
  has_function_privilege('service_role', oid, 'EXECUTE') as service_role_exec,
  has_function_privilege('public', oid, 'EXECUTE') as public_exec
from targets
order by fn;
```

Resultado esperado:
- `rpc_create_request`, `rpc_get_request_detail`, `rpc_export_dataset`:
  - `anon_exec = false`
  - `public_exec = false`
  - `authenticated_exec = true`
  - `service_role_exec = true`
- `log_audit_event`:
  - `anon_exec = false`
  - `authenticated_exec = false`
  - `service_role_exec = false`
  - `public_exec = false`

## 4) Evidencia minima para release

Guardar en ticket/PR:
- salida de `supabase migration list` o captura de Dashboard con migracion aplicada,
- resultado SQL de `search_path`,
- resultado SQL de privilegios.
