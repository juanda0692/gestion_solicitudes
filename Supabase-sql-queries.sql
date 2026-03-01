-- Items for selected PDVs
select *
from public.solicitudes_items_por_pdv(
  ARRAY['PDV001','PDV002']::text[],
  'CAN001'
)
limit 50;


-- Items de solicitudes por PDV
create or replace function public.solicitudes_items_por_pdv(
  p_pdv_ids text[],
  p_canal_id text
)
returns table(
  region_id            text,
  region_nombre        text,
  subterritorio_id     text,
  subterritorio_nombre text,
  pdv_id               text,
  pdv_nombre           text,
  canal_id             text,
  canal_nombre         text,
  solicitud_id         int,
  campaña_id           text,
  campaña_nombre       text,
  prioridad            int,
  zonas                jsonb,
  solicitud_obs        text,
  creado_por           text,
  solicitud_created_at timestamptz,
  item_id              int,
  material_id          text,
  material_nombre      text,
  material_medidas     text,
  item_cantidad        int,
  item_obs             text,
  medida_etiqueta      text,
  medida_custom        text,
  stock_canal          int
)
language sql
stable
security definer
as $$
  select
    r.id              as region_id,
    r.nombre          as region_nombre,
    st.id             as subterritorio_id,
    st.nombre         as subterritorio_nombre,
    p.id              as pdv_id,
    p.nombre          as pdv_nombre,
    p_canal_id        as canal_id,
    c.nombre          as canal_nombre,
    s.id              as solicitud_id,
    s.campaña_id      as campaña_id,
    ca.nombre         as campaña_nombre,
    s.prioridad       as prioridad,
    s.zonas           as zonas,
    s.observaciones   as solicitud_obs,
    s.creado_por      as creado_por,
    s.created_at      as solicitud_created_at,
    si.id             as item_id,
    si.material_id    as material_id,
    m.nombre          as material_nombre,
    m.medidas         as material_medidas,
    si.cantidad       as item_cantidad,
    si.observaciones  as item_obs,
    si.medida_etiqueta,
    si.medida_custom,
    mpc.stock         as stock_canal
  from public.solicitudes s
  join public.pdvs p             on p.id = s.pdv_id
  join public.subterritorios st  on st.id = p.subterritorio_id
  join public.regiones r         on r.id = st.region_id
  left join public.campañas ca   on ca.id = s.campaña_id
  join public.solicitud_items si on si.solicitud_id = s.id
  left join public.materiales m  on m.id = si.material_id
  left join public.canales c     on c.id = p_canal_id
  left join public.materiales_por_canal mpc
         on mpc.material_id = si.material_id
        and mpc.canal_id    = p_canal_id
  where s.pdv_id = any(p_pdv_ids)
  order by
    r.nombre nulls last,
    c.nombre nulls last,
    p.nombre,
    s.id,
    si.id;
$$;

-- (si usas PostgREST con 'anon'/'authenticated')
-- grant execute on function public.solicitudes_items_por_pdv(text[], text) to anon, authenticated;


-- Canal material inventory
SELECT 
  mpc.material_id,
  m.nombre AS name,
  mpc.canal_id,
  mpc.stock,
  mpc.created_at,
  mpc.updated_at
FROM materiales_por_canal AS mpc
JOIN materiales AS m ON mpc.material_id = m.id
WHERE mpc.canal_id = mpc.canal_id;


-- Recipients database squema for Supabase
SELECT r.nombre as region, s.nombre as subterritorio, p.nombre as pdv 
FROM regiones r 
JOIN subterritorios s ON r.id = s.region_id 
JOIN pdvs p ON s.id = p.subterritorio_id 
LIMIT 5;
