-- Hardening de funciones SECURITY DEFINER:
-- 1) search_path defensivo
-- 2) privilegios EXECUTE explicitos

alter function if exists public.log_audit_event(uuid, uuid, text, text, text, jsonb)
  set search_path = public, pg_temp;

alter function if exists public.rpc_create_request(jsonb)
  set search_path = public, pg_temp;

alter function if exists public.rpc_get_request_detail(bigint)
  set search_path = public, pg_temp;

alter function if exists public.rpc_export_dataset(jsonb)
  set search_path = public, pg_temp;

-- log_audit_event solo debe invocarse internamente.
revoke all on function public.log_audit_event(uuid, uuid, text, text, text, jsonb) from public;
revoke all on function public.log_audit_event(uuid, uuid, text, text, text, jsonb) from anon;
revoke all on function public.log_audit_event(uuid, uuid, text, text, text, jsonb) from authenticated;
revoke all on function public.log_audit_event(uuid, uuid, text, text, text, jsonb) from service_role;

-- RPCs accesibles solo para usuarios autenticados y service role.
revoke all on function public.rpc_create_request(jsonb) from public;
revoke all on function public.rpc_create_request(jsonb) from anon;
grant execute on function public.rpc_create_request(jsonb) to authenticated;
grant execute on function public.rpc_create_request(jsonb) to service_role;

revoke all on function public.rpc_get_request_detail(bigint) from public;
revoke all on function public.rpc_get_request_detail(bigint) from anon;
grant execute on function public.rpc_get_request_detail(bigint) to authenticated;
grant execute on function public.rpc_get_request_detail(bigint) to service_role;

revoke all on function public.rpc_export_dataset(jsonb) from public;
revoke all on function public.rpc_export_dataset(jsonb) from anon;
grant execute on function public.rpc_export_dataset(jsonb) to authenticated;
grant execute on function public.rpc_export_dataset(jsonb) to service_role;
