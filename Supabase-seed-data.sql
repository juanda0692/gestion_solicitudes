-- Seed data de volumen para Base Destinatarios en Supabase
-- Objetivo:
-- - Aproximar el volumen esperado del MVP
-- - Probar carga de catalogos, filtros, historial y detalle desde Supabase
-- - Mantener consistencia con el schema actual de Supabase-schema-data.sql
--
-- Volumen aproximado generado:
-- - 4 regiones
-- - 16 subterritorios
-- - 400 PDVs
-- - 4 canales
-- - 100 materiales
-- - 7 campanas
-- - 300 solicitudes
-- - 900 items de solicitud

begin;

truncate table
  solicitud_items,
  solicitudes,
  materiales_por_canal,
  materiales,
  campaÃ±as,
  pdvs,
  subterritorios,
  regiones,
  canales
restart identity cascade;

-- Regiones base
insert into regiones (id, nombre)
values
  ('REG001', 'Bogota'),
  ('REG002', 'Andina'),
  ('REG003', 'Costa'),
  ('REG004', 'Sur');

-- Canales base
insert into canales (id, nombre)
values
  ('CAN001', 'Tiendas'),
  ('CAN002', 'FVD Home'),
  ('CAN003', 'Islas'),
  ('CAN004', 'Tigo Express');

-- 16 subterritorios, 4 por region
insert into subterritorios (id, region_id, nombre)
select
  'SUB' || lpad(gs::text, 3, '0') as id,
  case
    when gs between 1 and 4 then 'REG001'
    when gs between 5 and 8 then 'REG002'
    when gs between 9 and 12 then 'REG003'
    else 'REG004'
  end as region_id,
  case
    when gs between 1 and 4 then 'Bogota Zona ' || gs
    when gs between 5 and 8 then 'Andina Zona ' || (gs - 4)
    when gs between 9 and 12 then 'Costa Zona ' || (gs - 8)
    else 'Sur Zona ' || (gs - 12)
  end as nombre
from generate_series(1, 16) as gs;

-- 400 PDVs distribuidos entre los 16 subterritorios
insert into pdvs (id, subterritorio_id, nombre)
select
  'PDV' || lpad(gs::text, 4, '0') as id,
  'SUB' || lpad((((gs - 1) % 16) + 1)::text, 3, '0') as subterritorio_id,
  case
    when (((gs - 1) % 16) + 1) between 1 and 4 then 'PDV Bogota '
    when (((gs - 1) % 16) + 1) between 5 and 8 then 'PDV Andina '
    when (((gs - 1) % 16) + 1) between 9 and 12 then 'PDV Costa '
    else 'PDV Sur '
  end || lpad(gs::text, 4, '0') as nombre
from generate_series(1, 400) as gs;

-- 100 materiales con variedad de categorias y stock base
insert into materiales (id, nombre, descripcion, stock)
select
  'MAT' || lpad(gs::text, 3, '0') as id,
  case
    when gs between 1 and 15 then 'Sticker POP ' || gs
    when gs between 16 and 30 then 'Volante A4 ' || (gs - 15)
    when gs between 31 and 45 then 'Afiche A3 ' || (gs - 30)
    when gs between 46 and 60 then 'Banner Vertical ' || (gs - 45)
    when gs between 61 and 75 then 'Display Mostrador ' || (gs - 60)
    when gs between 76 and 90 then 'Vinilo Fachada ' || (gs - 75)
    else 'Totem Promocional ' || (gs - 90)
  end as nombre,
  'Material fake para pruebas de UI, filtros y rendimiento #' || gs as descripcion,
  case
    when gs % 10 = 0 then 40
    when gs % 7 = 0 then 75
    when gs % 5 = 0 then 120
    else 250
  end as stock
from generate_series(1, 100) as gs;

-- 7 campanas
insert into campaÃ±as (id, nombre, prioridad)
values
  ('CAM001', 'CampaÃ±a Verano 2026', 1),
  ('CAM002', 'Regreso a Clases 2026', 2),
  ('CAM003', 'CampaÃ±a Hogares 2026', 2),
  ('CAM004', 'Mid Year Boost 2026', 3),
  ('CAM005', 'Black Friday 2026', 1),
  ('CAM006', 'Navidad 2026', 1),
  ('CAM007', 'Renovaciones Q1 2027', 3);

-- Materiales por canal
-- Cada material queda disponible en 2 o 3 canales para simular catalogos reales
insert into materiales_por_canal (material_id, canal_id, stock)
select
  m.id as material_id,
  c.id as canal_id,
  greatest(10, m.stock - (((row_number() over (partition by m.id order by c.id)) - 1) * 15)) as stock
from materiales m
join canales c
  on (
    ((substring(m.id from 4)::int + substring(c.id from 4)::int) % 2 = 0)
    or c.id = 'CAN001'
  );

-- 300 solicitudes distribuidas a lo largo del catalogo de PDVs y campanas
insert into solicitudes (
  region_id,
  subterritorio_id,
  pdv_id,
  campaÃ±a_id,
  prioridad,
  zonas,
  observaciones,
  creado_por,
  created_at,
  updated_at
)
select
  st.region_id,
  p.subterritorio_id,
  p.id as pdv_id,
  'CAM' || lpad((((gs - 1) % 7) + 1)::text, 3, '0') as campaÃ±a_id,
  (((gs - 1) % 3) + 1) as prioridad,
  case
    when gs % 3 = 0 then '["Fachada","Zona de experiencia"]'::jsonb
    when gs % 3 = 1 then '["Mesas asesores"]'::jsonb
    else '["Fachada","Mesas asesores"]'::jsonb
  end as zonas,
  'Solicitud fake #' || gs || ' para pruebas desde Supabase' as observaciones,
  'usuario' || (((gs - 1) % 18) + 1) as creado_por,
  now() - ((gs % 120) || ' days')::interval - ((gs % 11) || ' hours')::interval as created_at,
  now() - ((gs % 120) || ' days')::interval - ((gs % 11) || ' hours')::interval as updated_at
from generate_series(1, 300) as gs
join pdvs p
  on p.id = 'PDV' || lpad((((gs - 1) % 400) + 1)::text, 4, '0')
join subterritorios st
  on st.id = p.subterritorio_id;

-- 3 items por solicitud = 900 items
-- Se eligen materiales que existan para el canal derivado del PDV
with pdv_channel as (
  select
    p.id as pdv_id,
    case
      when (substring(p.id from 4)::int % 4) = 1 then 'CAN001'
      when (substring(p.id from 4)::int % 4) = 2 then 'CAN002'
      when (substring(p.id from 4)::int % 4) = 3 then 'CAN003'
      else 'CAN004'
    end as canal_id
  from pdvs p
),
solicitudes_base as (
  select
    s.id as solicitud_id,
    s.pdv_id,
    pc.canal_id
  from solicitudes s
  join pdv_channel pc on pc.pdv_id = s.pdv_id
),
materiales_canal_ranked as (
  select
    mpc.canal_id,
    mpc.material_id,
    row_number() over (partition by mpc.canal_id order by mpc.material_id) as rn,
    count(*) over (partition by mpc.canal_id) as total_por_canal
  from materiales_por_canal mpc
),
items_seed as (
  select
    sb.solicitud_id,
    sb.canal_id,
    idx.item_pos,
    ((sb.solicitud_id + (idx.item_pos * 7)) % mcr.total_por_canal) + 1 as target_rn
  from solicitudes_base sb
  cross join (values (1), (2), (3)) as idx(item_pos)
  join materiales_canal_ranked mcr on mcr.canal_id = sb.canal_id
  group by sb.solicitud_id, sb.canal_id, idx.item_pos, mcr.total_por_canal
)
insert into solicitud_items (
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
  i.solicitud_id,
  mcr.material_id,
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
  'Item fake ' || i.item_pos || ' de la solicitud ' || i.solicitud_id as observaciones,
  now() - ((i.solicitud_id % 120) || ' days')::interval as created_at,
  now() - ((i.solicitud_id % 120) || ' days')::interval as updated_at
from items_seed i
join materiales_canal_ranked mcr
  on mcr.canal_id = i.canal_id
 and mcr.rn = i.target_rn;

commit;
