-- Volume seed for the Supabase-first schema.
-- Target volumes:
-- - 1 demo tenant
-- - 4 regiones
-- - 16 subterritorios
-- - 400 PDVs
-- - 4 canales
-- - 100 materiales
-- - 7 campanias
-- - 320 solicitudes when at least one profile exists for the demo tenant
-- - 960 solicitud_items when requests are generated

begin;

create extension if not exists "pgcrypto";

insert into public.tenants (id, code, name)
values ('00000000-0000-0000-0000-000000000001', 'demo', 'Tenant Demo Tigo')
on conflict (id) do update
set code = excluded.code,
    name = excluded.name,
    updated_at = now();

-- Remove previous demo-tenant business data while preserving auth-linked profiles.
delete from public.audit_log where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.export_jobs where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.solicitud_items where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.solicitudes where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.materiales_por_canal where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.materiales where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.pdvs where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.subterritorios where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.campanias where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.canales where tenant_id = '00000000-0000-0000-0000-000000000001';
delete from public.regiones where tenant_id = '00000000-0000-0000-0000-000000000001';

update public.profiles
set tenant_id = '00000000-0000-0000-0000-000000000001',
    app_role = coalesce(app_role, 'requester'),
    updated_at = now()
where email in ('demo@tigo.com', 'demo1@tigo.com', 'demo2@tigo.com', 'demo3@tigo.com')
   or tenant_id = '00000000-0000-0000-0000-000000000001';

insert into public.regiones (id, tenant_id, nombre, sort_order)
values
  ('region-bogota', '00000000-0000-0000-0000-000000000001', 'Bogota', 1),
  ('region-andina', '00000000-0000-0000-0000-000000000001', 'Andina', 2),
  ('region-costa', '00000000-0000-0000-0000-000000000001', 'Costa', 3),
  ('region-sur', '00000000-0000-0000-0000-000000000001', 'Sur', 4);

insert into public.canales (id, tenant_id, nombre)
values
  ('tiendas', '00000000-0000-0000-0000-000000000001', 'Tiendas'),
  ('fvd-home', '00000000-0000-0000-0000-000000000001', 'FVD Home'),
  ('islas', '00000000-0000-0000-0000-000000000001', 'Islas'),
  ('tigo-express', '00000000-0000-0000-0000-000000000001', 'Tigo Express');

insert into public.subterritorios (id, tenant_id, region_id, nombre, sort_order)
select
  format('sub-%s-%s', region_code, zone_idx) as id,
  '00000000-0000-0000-0000-000000000001'::uuid as tenant_id,
  region_id,
  format('%s Zona %s', region_name, zone_idx) as nombre,
  zone_idx as sort_order
from (
  values
    ('region-bogota', 'bogota', 'Bogota'),
    ('region-andina', 'andina', 'Andina'),
    ('region-costa', 'costa', 'Costa'),
    ('region-sur', 'sur', 'Sur')
) as regions(region_id, region_code, region_name)
cross join generate_series(1, 4) as zone_idx;

insert into public.pdvs (
  id,
  tenant_id,
  subterritorio_id,
  canal_id,
  codigo,
  nombre,
  direccion,
  ciudad,
  metadata
)
select
  format('pdv-%s-%s', zone_id, lpad(pdv_idx::text, 3, '0')) as id,
  '00000000-0000-0000-0000-000000000001'::uuid as tenant_id,
  zone_id as subterritorio_id,
  canal_id,
  format('COD-%s-%s', upper(zone_id), lpad(pdv_idx::text, 3, '0')) as codigo,
  format('PDV %s %s', initcap(replace(zone_id, '-', ' ')), lpad(pdv_idx::text, 3, '0')) as nombre,
  format('Calle %s #%s-%s', 10 + pdv_idx, 20 + zone_ord, 30 + pdv_idx) as direccion,
  region_name as ciudad,
  jsonb_build_object(
    'segmento', case when pdv_idx % 4 = 0 then 'premium' when pdv_idx % 3 = 0 then 'masivo' else 'estandar' end,
    'cluster', format('cluster-%s', ((zone_ord - 1) % 4) + 1),
    'zona_ordinal', zone_ord,
    'pdv_ordinal', pdv_idx
  ) as metadata
from (
  select
    st.id as zone_id,
    st.nombre as zone_name,
    row_number() over (order by st.id) as zone_ord,
    r.nombre as region_name,
    case ((row_number() over (order by st.id) - 1) % 4)
      when 0 then 'tiendas'
      when 1 then 'fvd-home'
      when 2 then 'islas'
      else 'tigo-express'
    end as canal_id
  from public.subterritorios st
  join public.regiones r on r.id = st.region_id
  where st.tenant_id = '00000000-0000-0000-0000-000000000001'
) zones
cross join generate_series(1, 25) as pdv_idx;

insert into public.campanias (
  id,
  tenant_id,
  nombre,
  prioridad,
  status,
  starts_at,
  ends_at
)
values
  ('camp-2026-verano', '00000000-0000-0000-0000-000000000001', 'Campania Verano 2026', 1, 'active', '2026-01-10T00:00:00Z', '2026-03-15T23:59:59Z'),
  ('camp-2026-clases', '00000000-0000-0000-0000-000000000001', 'Regreso a Clases 2026', 2, 'active', '2026-01-20T00:00:00Z', '2026-02-28T23:59:59Z'),
  ('camp-2026-hogares', '00000000-0000-0000-0000-000000000001', 'Campania Hogares 2026', 2, 'active', '2026-02-01T00:00:00Z', '2026-04-30T23:59:59Z'),
  ('camp-2026-midyear', '00000000-0000-0000-0000-000000000001', 'Mid Year Boost 2026', 3, 'active', '2026-05-15T00:00:00Z', '2026-07-15T23:59:59Z'),
  ('camp-2026-blackfriday', '00000000-0000-0000-0000-000000000001', 'Black Friday 2026', 1, 'planned', '2026-11-01T00:00:00Z', '2026-11-30T23:59:59Z'),
  ('camp-2026-navidad', '00000000-0000-0000-0000-000000000001', 'Navidad 2026', 1, 'planned', '2026-12-01T00:00:00Z', '2026-12-31T23:59:59Z'),
  ('camp-2027-renovaciones', '00000000-0000-0000-0000-000000000001', 'Renovaciones Q1 2027', 3, 'planned', '2027-01-05T00:00:00Z', '2027-03-31T23:59:59Z');

insert into public.materiales (
  id,
  tenant_id,
  nombre,
  descripcion,
  medida_estandar,
  unidad_medida
)
select
  format('material-%s', lpad(gs::text, 3, '0')) as id,
  '00000000-0000-0000-0000-000000000001'::uuid as tenant_id,
  case
    when gs between 1 and 15 then format('Sticker POP %s', gs)
    when gs between 16 and 30 then format('Volante A4 %s', gs - 15)
    when gs between 31 and 45 then format('Afiche A3 %s', gs - 30)
    when gs between 46 and 60 then format('Banner Vertical %s', gs - 45)
    when gs between 61 and 75 then format('Display Mostrador %s', gs - 60)
    when gs between 76 and 90 then format('Vinilo Fachada %s', gs - 75)
    else format('Totem Promocional %s', gs - 90)
  end as nombre,
  format('Material seed de volumen para pruebas de UI y rendimiento #%s', gs) as descripcion,
  case
    when gs between 1 and 15 then '10x10cm'
    when gs between 16 and 30 then '21x29.7cm'
    when gs between 31 and 45 then '29.7x42cm'
    when gs between 46 and 60 then '80x200cm'
    when gs between 61 and 75 then '25x35cm'
    when gs between 76 and 90 then '120x80cm'
    else '60x180cm'
  end as medida_estandar,
  case when gs % 9 = 0 then 'kit' when gs % 2 = 0 then 'paquete' else 'unidad' end as unidad_medida
from generate_series(1, 100) as gs;

insert into public.materiales_por_canal (
  tenant_id,
  material_id,
  canal_id,
  stock,
  min_stock_alert
)
select
  '00000000-0000-0000-0000-000000000001'::uuid as tenant_id,
  m.id as material_id,
  c.id as canal_id,
  case
    when ((substring(m.id from 10)::int + length(c.id)) % 9) = 0 then 18
    when ((substring(m.id from 10)::int + length(c.id)) % 5) = 0 then 42
    when c.id = 'tiendas' then 180
    else 95
  end as stock,
  15 as min_stock_alert
from public.materiales m
join public.canales c
  on c.tenant_id = m.tenant_id
 and (
   c.id = 'tiendas'
   or ((substring(m.id from 10)::int + length(c.id)) % 2 = 0)
 )
where m.tenant_id = '00000000-0000-0000-0000-000000000001';

with demo_users as (
  select
    p.id,
    p.email,
    row_number() over (order by p.created_at, p.id) as user_ord,
    count(*) over () as user_count
  from public.profiles p
  where p.tenant_id = '00000000-0000-0000-0000-000000000001'
    and p.is_active = true
),
base_requests as (
  select
    gs as seq,
    ('00000000-0000-0000-0000-' || lpad(gs::text, 12, '0'))::uuid as client_request_id,
    p.id as pdv_id,
    p.subterritorio_id,
    st.region_id,
    p.canal_id,
    (select c.id from public.campanias c where c.tenant_id = '00000000-0000-0000-0000-000000000001' order by c.id offset ((gs - 1) % 7) limit 1) as campania_id,
    case when gs % 4 = 0 then 1 when gs % 4 = 1 then 2 when gs % 4 = 2 then 3 else 2 end as prioridad,
    case
      when gs % 3 = 0 then '["Fachada","Zona de experiencia"]'::jsonb
      when gs % 3 = 1 then '["Mesas asesores"]'::jsonb
      else '["Fachada","Mesas asesores"]'::jsonb
    end as zonas,
    format('Solicitud seed #%s para pruebas de volumen desde Supabase', gs) as observaciones,
    case when gs % 7 = 0 then 'approved' when gs % 5 = 0 then 'processing' else 'submitted' end as status,
    u.id as created_by,
    now() - make_interval(days => (gs % 120), hours => (gs % 11)) as created_at
  from generate_series(1, 320) as gs
  join public.pdvs p
    on p.tenant_id = '00000000-0000-0000-0000-000000000001'
   and p.id = (
     select p2.id
     from public.pdvs p2
     where p2.tenant_id = '00000000-0000-0000-0000-000000000001'
     order by p2.id
     offset ((gs - 1) % 400)
     limit 1
   )
  join public.subterritorios st on st.id = p.subterritorio_id
  join demo_users u
    on u.user_ord = (((gs - 1) % u.user_count) + 1)
)
insert into public.solicitudes (
  tenant_id,
  client_request_id,
  region_id,
  subterritorio_id,
  pdv_id,
  canal_id,
  campania_id,
  status,
  prioridad,
  zonas,
  observaciones,
  created_by,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000001'::uuid,
  client_request_id,
  region_id,
  subterritorio_id,
  pdv_id,
  canal_id,
  campania_id,
  status,
  prioridad,
  zonas,
  observaciones,
  created_by,
  created_at,
  created_at
from base_requests;

with request_base as (
  select
    s.id as solicitud_id,
    s.canal_id,
    s.created_at,
    row_number() over (order by s.id) as req_ord
  from public.solicitudes s
  where s.tenant_id = '00000000-0000-0000-0000-000000000001'
),
material_rank as (
  select
    mpc.canal_id,
    mpc.material_id,
    row_number() over (partition by mpc.canal_id order by mpc.material_id) as rn,
    count(*) over (partition by mpc.canal_id) as total_per_channel
  from public.materiales_por_canal mpc
  where mpc.tenant_id = '00000000-0000-0000-0000-000000000001'
),
item_seed as (
  select
    rb.solicitud_id,
    rb.canal_id,
    rb.created_at,
    pos.item_pos,
    ((rb.req_ord + (pos.item_pos * 7)) % mr.total_per_channel) + 1 as target_rn
  from request_base rb
  cross join (values (1), (2), (3)) as pos(item_pos)
  join material_rank mr on mr.canal_id = rb.canal_id
  group by rb.solicitud_id, rb.canal_id, rb.created_at, pos.item_pos, mr.total_per_channel, rb.req_ord
)
insert into public.solicitud_items (
  tenant_id,
  solicitud_id,
  material_id,
  cantidad,
  medida_etiqueta,
  medida_custom,
  observaciones,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000001'::uuid,
  i.solicitud_id,
  mr.material_id,
  case
    when i.item_pos = 1 then ((i.solicitud_id % 5) + 1) * 2
    when i.item_pos = 2 then ((i.solicitud_id % 4) + 1) * 5
    else ((i.solicitud_id % 3) + 1) * 8
  end as cantidad,
  case
    when i.item_pos = 1 then 'unidades'
    when i.item_pos = 2 then 'paquetes'
    else 'kits'
  end as medida_etiqueta,
  null as medida_custom,
  format('Item seed %s de la solicitud %s', i.item_pos, i.solicitud_id) as observaciones,
  i.created_at,
  i.created_at
from item_seed i
join material_rank mr
  on mr.canal_id = i.canal_id
 and mr.rn = i.target_rn;

commit;
