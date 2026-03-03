drop function if exists public.rpc_export_dataset(jsonb);

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
  coalesce(pr.display_name, pr.email, s.created_by::text) as created_by_name,
  s.observaciones,
  si.id as item_id,
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
left join public.campanias cp on cp.id = s.campania_id
left join public.profiles pr on pr.id = s.created_by;

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
    and (
      coalesce(jsonb_array_length(filters->'pdvIds'), 0) = 0
      or pdv_id in (
        select jsonb_array_elements_text(filters->'pdvIds')
      )
    )
$$;
