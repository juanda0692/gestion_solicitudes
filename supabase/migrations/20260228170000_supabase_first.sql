create extension if not exists "pgcrypto";

create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  email text not null,
  display_name text not null,
  app_role text not null default 'requester',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.regiones (
  id text primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  nombre text not null,
  sort_order int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.canales (
  id text primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  nombre text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subterritorios (
  id text primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  region_id text not null references public.regiones(id) on delete restrict,
  nombre text not null,
  sort_order int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pdvs (
  id text primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  subterritorio_id text not null references public.subterritorios(id) on delete restrict,
  canal_id text references public.canales(id) on delete restrict,
  codigo text,
  nombre text not null,
  direccion text,
  ciudad text,
  metadata jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campanias (
  id text primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  nombre text not null,
  prioridad int not null default 0,
  status text not null default 'active',
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materiales (
  id text primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  nombre text not null,
  descripcion text,
  medida_estandar text,
  unidad_medida text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.materiales_por_canal (
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  material_id text not null references public.materiales(id) on delete restrict,
  canal_id text not null references public.canales(id) on delete restrict,
  stock int not null default 0 check (stock >= 0),
  min_stock_alert int,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, material_id, canal_id)
);

create table if not exists public.solicitudes (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  client_request_id uuid not null,
  region_id text references public.regiones(id) on delete restrict,
  subterritorio_id text references public.subterritorios(id) on delete restrict,
  pdv_id text not null references public.pdvs(id) on delete restrict,
  canal_id text not null references public.canales(id) on delete restrict,
  campania_id text references public.campanias(id) on delete restrict,
  status text not null default 'submitted',
  prioridad int,
  zonas jsonb not null default '[]'::jsonb,
  observaciones text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, client_request_id)
);

create table if not exists public.solicitud_items (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  solicitud_id bigint not null references public.solicitudes(id) on delete cascade,
  material_id text not null references public.materiales(id) on delete restrict,
  cantidad int not null check (cantidad > 0),
  medida_etiqueta text,
  medida_custom text,
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.export_jobs (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  requested_by uuid not null references auth.users(id) on delete restrict,
  status text not null default 'pending',
  filters jsonb not null default '{}'::jsonb,
  file_name text,
  file_url text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  tenant_id uuid not null references public.tenants(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete set null,
  entity_name text not null,
  entity_id text not null,
  action text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_subterritorios_tenant_region_nombre on public.subterritorios(tenant_id, region_id, nombre);
create index if not exists idx_pdvs_tenant_subterritorio_nombre on public.pdvs(tenant_id, subterritorio_id, nombre);
create index if not exists idx_pdvs_tenant_canal_nombre on public.pdvs(tenant_id, canal_id, nombre);
create index if not exists idx_campanias_tenant_active_nombre on public.campanias(tenant_id, is_active, nombre);
create index if not exists idx_materiales_por_canal_tenant_canal_material on public.materiales_por_canal(tenant_id, canal_id, material_id);
create index if not exists idx_materiales_por_canal_tenant_canal_stock on public.materiales_por_canal(tenant_id, canal_id, stock);
create index if not exists idx_solicitudes_tenant_created_at on public.solicitudes(tenant_id, created_at desc);
create index if not exists idx_solicitudes_tenant_created_by_created_at on public.solicitudes(tenant_id, created_by, created_at desc);
create index if not exists idx_solicitudes_tenant_pdv_created_at on public.solicitudes(tenant_id, pdv_id, created_at desc);
create index if not exists idx_solicitudes_tenant_campania_created_at on public.solicitudes(tenant_id, campania_id, created_at desc);
create index if not exists idx_solicitud_items_tenant_solicitud on public.solicitud_items(tenant_id, solicitud_id);
create index if not exists idx_export_jobs_tenant_requested_by_created_at on public.export_jobs(tenant_id, requested_by, created_at desc);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_tenant_id()
returns uuid
language sql
stable
as $$
  select tenant_id
  from public.profiles
  where id = auth.uid()
  limit 1
$$;

create or replace function public.log_audit_event(
  p_tenant_id uuid,
  p_actor_id uuid,
  p_entity_name text,
  p_entity_id text,
  p_action text,
  p_payload jsonb default '{}'::jsonb
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.audit_log (tenant_id, actor_id, entity_name, entity_id, action, payload)
  values (p_tenant_id, p_actor_id, p_entity_name, p_entity_id, p_action, coalesce(p_payload, '{}'::jsonb));
end;
$$;

create or replace function public.rpc_create_request(payload jsonb)
returns jsonb
language plpgsql
security definer
as $$
declare
  v_tenant_id uuid;
  v_request_id bigint;
  v_now timestamptz := now();
  v_client_request_id uuid;
  v_item jsonb;
  v_existing_id bigint;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  v_tenant_id := public.current_user_tenant_id();
  if v_tenant_id is null then
    raise exception 'tenant_not_found';
  end if;

  v_client_request_id := coalesce((payload->>'client_request_id')::uuid, gen_random_uuid());

  select id into v_existing_id
  from public.solicitudes
  where tenant_id = v_tenant_id
    and client_request_id = v_client_request_id
  limit 1;

  if v_existing_id is not null then
    return jsonb_build_object(
      'requestId', v_existing_id,
      'solicitud_id', v_existing_id,
      'status', 'submitted',
      'created_at', v_now,
      'items', coalesce(jsonb_array_length(payload->'items'), 0),
      'items_count', coalesce(jsonb_array_length(payload->'items'), 0),
      'idempotent_replay', true
    );
  end if;

  if coalesce(jsonb_array_length(payload->'items'), 0) = 0 then
    raise exception 'items_required';
  end if;

  insert into public.solicitudes (
    tenant_id,
    client_request_id,
    region_id,
    subterritorio_id,
    pdv_id,
    canal_id,
    campania_id,
    prioridad,
    zonas,
    observaciones,
    created_by
  )
  values (
    v_tenant_id,
    v_client_request_id,
    payload->>'region_id',
    payload->>'subterritorio_id',
    payload->>'pdv_id',
    payload->>'canal_id',
    payload->>'campania_id',
    nullif(payload->>'prioridad', '')::int,
    coalesce(payload->'zonas', '[]'::jsonb),
    payload->>'observaciones',
    auth.uid()
  )
  returning id into v_request_id;

  for v_item in select * from jsonb_array_elements(payload->'items')
  loop
    update public.materiales_por_canal
    set stock = stock - (v_item->>'cantidad')::int
    where tenant_id = v_tenant_id
      and canal_id = payload->>'canal_id'
      and material_id = v_item->>'material_id'
      and stock >= (v_item->>'cantidad')::int;

    if not found then
      raise exception 'stock_insuficiente';
    end if;

    insert into public.solicitud_items (
      tenant_id,
      solicitud_id,
      material_id,
      cantidad,
      medida_etiqueta,
      medida_custom,
      observaciones
    )
    values (
      v_tenant_id,
      v_request_id,
      v_item->>'material_id',
      (v_item->>'cantidad')::int,
      v_item->>'medida_etiqueta',
      v_item->>'medida_custom',
      v_item->>'observaciones'
    );
  end loop;

  perform public.log_audit_event(v_tenant_id, auth.uid(), 'solicitudes', v_request_id::text, 'create_request', payload);

  return jsonb_build_object(
    'requestId', v_request_id,
    'solicitud_id', v_request_id,
    'status', 'submitted',
    'created_at', v_now,
    'items', coalesce(jsonb_array_length(payload->'items'), 0),
    'items_count', coalesce(jsonb_array_length(payload->'items'), 0),
    'idempotent_replay', false
  );
end;
$$;

create or replace function public.rpc_get_request_detail(p_request_id bigint)
returns jsonb
language sql
security definer
as $$
  select jsonb_build_object(
    'id', s.id,
    'header', jsonb_build_object(
      'region_id', s.region_id,
      'subterritorio_id', s.subterritorio_id,
      'pdv_id', s.pdv_id,
      'canal_id', s.canal_id,
      'campania_id', s.campania_id,
      'prioridad', s.prioridad,
      'zonas', s.zonas,
      'observaciones', s.observaciones,
      'created_by', s.created_by,
      'created_at', s.created_at,
      'status', s.status
    ),
    'items', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', si.id,
            'material_id', si.material_id,
            'material_name', m.nombre,
            'cantidad', si.cantidad,
            'medida_etiqueta', si.medida_etiqueta,
            'medida_custom', si.medida_custom,
            'observaciones', si.observaciones
          )
        )
        from public.solicitud_items si
        join public.materiales m on m.id = si.material_id
        where si.solicitud_id = s.id
      ),
      '[]'::jsonb
    )
  )
  from public.solicitudes s
  where s.id = p_request_id
    and s.tenant_id = public.current_user_tenant_id()
    and s.created_by = auth.uid()
$$;

drop view if exists public.v_regiones;
create view public.v_regiones
with (security_invoker = true) as
select id, tenant_id, nombre as name
from public.regiones
where is_active = true;

drop view if exists public.v_subterritorios;
create view public.v_subterritorios
with (security_invoker = true) as
select id, tenant_id, region_id, nombre as name
from public.subterritorios
where is_active = true;

drop view if exists public.v_pdvs;
create view public.v_pdvs
with (security_invoker = true) as
select id, tenant_id, subterritorio_id, canal_id, nombre as name, codigo
from public.pdvs
where is_active = true;

drop view if exists public.v_canales;
create view public.v_canales
with (security_invoker = true) as
select id, tenant_id, nombre as name
from public.canales
where is_active = true;

drop view if exists public.v_campanias;
create view public.v_campanias
with (security_invoker = true) as
select id, tenant_id, nombre as name, prioridad as priority, status
from public.campanias
where is_active = true;

drop view if exists public.v_materiales_por_canal;
create view public.v_materiales_por_canal
with (security_invoker = true) as
select
  mpc.tenant_id,
  mpc.canal_id,
  mpc.material_id,
  m.nombre as name,
  m.descripcion as description,
  m.medida_estandar,
  mpc.stock
from public.materiales_por_canal mpc
join public.materiales m on m.id = mpc.material_id
where mpc.is_active = true
  and m.is_active = true;

drop view if exists public.v_solicitudes_list;
create view public.v_solicitudes_list
with (security_invoker = true) as
select
  s.id,
  s.tenant_id,
  s.pdv_id,
  p.nombre as pdv_name,
  s.region_id,
  r.nombre as region_name,
  s.subterritorio_id,
  st.nombre as subterritorio_name,
  s.canal_id,
  c.nombre as canal_name,
  s.campania_id,
  cp.nombre as campania_name,
  s.status,
  s.prioridad,
  (select count(*) from public.solicitud_items si where si.solicitud_id = s.id) as items_count,
  s.created_by,
  s.created_at
from public.solicitudes s
left join public.pdvs p on p.id = s.pdv_id
left join public.regiones r on r.id = s.region_id
left join public.subterritorios st on st.id = s.subterritorio_id
left join public.canales c on c.id = s.canal_id
left join public.campanias cp on cp.id = s.campania_id;

drop view if exists public.v_solicitudes_export;
create view public.v_solicitudes_export
with (security_invoker = true) as
select
  s.id as solicitud_id,
  s.tenant_id,
  s.created_at,
  s.status,
  s.canal_id,
  c.nombre as canal_name,
  s.region_id,
  r.nombre as region_name,
  s.subterritorio_id,
  st.nombre as subterritorio_name,
  s.pdv_id,
  p.nombre as pdv_name,
  s.campania_id,
  cp.nombre as campania_name,
  s.prioridad,
  s.created_by,
  s.observaciones,
  si.material_id,
  m.nombre as material_name,
  si.cantidad,
  si.medida_etiqueta,
  si.medida_custom,
  si.observaciones as item_observaciones
from public.solicitudes s
join public.solicitud_items si on si.solicitud_id = s.id
join public.materiales m on m.id = si.material_id
left join public.pdvs p on p.id = s.pdv_id
left join public.regiones r on r.id = s.region_id
left join public.subterritorios st on st.id = s.subterritorio_id
left join public.canales c on c.id = s.canal_id
left join public.campanias cp on cp.id = s.campania_id;

create or replace function public.rpc_export_dataset(filters jsonb)
returns setof public.v_solicitudes_export
language sql
security definer
as $$
  select *
  from public.v_solicitudes_export
  where tenant_id = public.current_user_tenant_id()
    and (filters->>'canal_id' is null or canal_id = filters->>'canal_id')
    and (filters->>'region_id' is null or region_id = filters->>'region_id')
    and (filters->>'subterritorio_id' is null or subterritorio_id = filters->>'subterritorio_id')
    and (filters->>'pdv_id' is null or pdv_id = filters->>'pdv_id')
    and (filters->>'campania_id' is null or campania_id = filters->>'campania_id')
    and (filters->>'status' is null or status = filters->>'status')
$$;

create trigger trg_tenants_updated_at before update on public.tenants for each row execute function public.touch_updated_at();
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.touch_updated_at();
create trigger trg_regiones_updated_at before update on public.regiones for each row execute function public.touch_updated_at();
create trigger trg_canales_updated_at before update on public.canales for each row execute function public.touch_updated_at();
create trigger trg_subterritorios_updated_at before update on public.subterritorios for each row execute function public.touch_updated_at();
create trigger trg_pdvs_updated_at before update on public.pdvs for each row execute function public.touch_updated_at();
create trigger trg_campanias_updated_at before update on public.campanias for each row execute function public.touch_updated_at();
create trigger trg_materiales_updated_at before update on public.materiales for each row execute function public.touch_updated_at();
create trigger trg_materiales_por_canal_updated_at before update on public.materiales_por_canal for each row execute function public.touch_updated_at();
create trigger trg_solicitudes_updated_at before update on public.solicitudes for each row execute function public.touch_updated_at();
create trigger trg_solicitud_items_updated_at before update on public.solicitud_items for each row execute function public.touch_updated_at();
create trigger trg_export_jobs_updated_at before update on public.export_jobs for each row execute function public.touch_updated_at();

alter table public.tenants enable row level security;
alter table public.profiles enable row level security;
alter table public.regiones enable row level security;
alter table public.canales enable row level security;
alter table public.subterritorios enable row level security;
alter table public.pdvs enable row level security;
alter table public.campanias enable row level security;
alter table public.materiales enable row level security;
alter table public.materiales_por_canal enable row level security;
alter table public.solicitudes enable row level security;
alter table public.solicitud_items enable row level security;
alter table public.export_jobs enable row level security;
alter table public.audit_log enable row level security;

create policy tenants_read_own on public.tenants for select using (id = public.current_user_tenant_id());
create policy profiles_self_read on public.profiles for select using (id = auth.uid());
create policy catalog_regions_read on public.regiones for select using (tenant_id = public.current_user_tenant_id());
create policy catalog_channels_read on public.canales for select using (tenant_id = public.current_user_tenant_id());
create policy catalog_subterritorios_read on public.subterritorios for select using (tenant_id = public.current_user_tenant_id());
create policy catalog_pdvs_read on public.pdvs for select using (tenant_id = public.current_user_tenant_id());
create policy catalog_campanias_read on public.campanias for select using (tenant_id = public.current_user_tenant_id());
create policy catalog_materiales_read on public.materiales for select using (tenant_id = public.current_user_tenant_id());
create policy catalog_materiales_por_canal_read on public.materiales_por_canal for select using (tenant_id = public.current_user_tenant_id());
create policy solicitudes_read_own on public.solicitudes for select using (tenant_id = public.current_user_tenant_id() and created_by = auth.uid());
create policy solicitud_items_read_own on public.solicitud_items for select using (
  tenant_id = public.current_user_tenant_id()
  and exists (
    select 1
    from public.solicitudes s
    where s.id = solicitud_id
      and s.created_by = auth.uid()
  )
);
create policy export_jobs_read_own on public.export_jobs for select using (tenant_id = public.current_user_tenant_id() and requested_by = auth.uid());
create policy audit_log_read_own on public.audit_log for select using (tenant_id = public.current_user_tenant_id() and actor_id = auth.uid());
