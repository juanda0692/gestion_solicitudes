alter table public.materiales
add column if not exists medida_estandar text;

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
