-- Migracion de endurecimiento para el schema actual de Supabase-schema-data.sql
-- Objetivo:
-- - quitar politicas abiertas
-- - introducir ownership real con auth.users
-- - dejar RLS minima segura para catálogos y solicitudes
-- - bloquear escrituras directas sensibles desde el cliente
--
-- Ejecutar DESPUES de Supabase-schema-data.sql

begin;

-- 1. Perfil base ligado a Supabase Auth
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  app_role text not null default 'requester',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger de updated_at para profiles
drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function update_updated_at_column();

-- 2. Ownership real para solicitudes
alter table public.solicitudes
  add column if not exists created_by uuid references auth.users(id);

create index if not exists idx_solicitudes_created_by on public.solicitudes(created_by);

-- 3. Asegurar RLS habilitada en tablas expuestas
alter table public.profiles enable row level security;
alter table public.regiones enable row level security;
alter table public.subterritorios enable row level security;
alter table public.pdvs enable row level security;
alter table public.canales enable row level security;
alter table public.materiales enable row level security;
alter table public.materiales_por_canal enable row level security;
alter table public.campañas enable row level security;
alter table public.solicitudes enable row level security;
alter table public.solicitud_items enable row level security;

-- 4. Eliminar politicas abiertas inseguras
drop policy if exists "Allow all operations" on public.regiones;
drop policy if exists "Allow all operations" on public.subterritorios;
drop policy if exists "Allow all operations" on public.pdvs;
drop policy if exists "Allow all operations" on public.canales;
drop policy if exists "Allow all operations" on public.materiales;
drop policy if exists "Allow all operations" on public.materiales_por_canal;
drop policy if exists "Allow all operations" on public.campañas;
drop policy if exists "Allow all operations" on public.solicitudes;
drop policy if exists "Allow all operations" on public.solicitud_items;
drop policy if exists "profiles allow all operations" on public.profiles;

-- 5. Funciones helper
create or replace function public.is_authenticated()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null
$$;

create or replace function public.current_user_email()
returns text
language sql
stable
as $$
  select email
  from public.profiles
  where id = auth.uid()
  limit 1
$$;

-- 6. Politicas seguras para perfiles
create policy profiles_select_self
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- 7. Politicas de solo lectura para catalogos
create policy regiones_select_authenticated
on public.regiones
for select
to authenticated
using ((select public.is_authenticated()));

create policy subterritorios_select_authenticated
on public.subterritorios
for select
to authenticated
using ((select public.is_authenticated()));

create policy pdvs_select_authenticated
on public.pdvs
for select
to authenticated
using ((select public.is_authenticated()));

create policy canales_select_authenticated
on public.canales
for select
to authenticated
using ((select public.is_authenticated()));

create policy materiales_select_authenticated
on public.materiales
for select
to authenticated
using ((select public.is_authenticated()));

create policy materiales_por_canal_select_authenticated
on public.materiales_por_canal
for select
to authenticated
using ((select public.is_authenticated()));

create policy campañas_select_authenticated
on public.campañas
for select
to authenticated
using ((select public.is_authenticated()));

-- 8. Solicitudes: cada usuario solo ve e inserta las suyas
create policy solicitudes_select_own
on public.solicitudes
for select
to authenticated
using (
  created_by = auth.uid()
);

create policy solicitudes_insert_own
on public.solicitudes
for insert
to authenticated
with check (
  created_by = auth.uid()
);

-- 9. Items: solo visibles si pertenecen a una solicitud del usuario
create policy solicitud_items_select_own
on public.solicitud_items
for select
to authenticated
using (
  exists (
    select 1
    from public.solicitudes s
    where s.id = solicitud_items.solicitud_id
      and s.created_by = auth.uid()
  )
);

-- No se crean policies de insert/update/delete sobre:
-- - materiales_por_canal
-- - solicitud_items
-- para impedir mutaciones directas desde el cliente autenticado.
-- Esas operaciones deben pasar por RPC o Edge Function.

-- 10. Recomendaciones de grants
-- Mantener anon sin acceso a estas tablas.
revoke all on public.profiles from anon;
revoke all on public.regiones from anon;
revoke all on public.subterritorios from anon;
revoke all on public.pdvs from anon;
revoke all on public.canales from anon;
revoke all on public.materiales from anon;
revoke all on public.materiales_por_canal from anon;
revoke all on public.campañas from anon;
revoke all on public.solicitudes from anon;
revoke all on public.solicitud_items from anon;

commit;
