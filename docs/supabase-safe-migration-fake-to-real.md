# Supabase Safe Migration Playbook (Fake -> Real Data)

## Objetivo
Definir un proceso repetible y seguro para pasar de datos fake a datos reales en Supabase sin romper seguridad, integridad ni operacion.

## Alcance
- Frontend React + Supabase (Auth, Postgres, RLS, RPC).
- Migraciones SQL del repo en `supabase/migrations/`.
- Carga de datos reales para catalogos y flujo transaccional.

## Reglas no negociables
1. Nunca ejecutar cambios en prod sin backup reciente.
2. Nunca abrir `EXECUTE` de RPC sensibles a `anon`.
3. Nunca desactivar RLS para "probar rapido".
4. Nunca mezclar fake y real en el mismo tenant productivo.
5. No usar `db reset` en entornos con data real.

## Estrategia recomendada
Usar un proyecto Supabase separado para datos reales (recomendado).  
Si no es posible, usar tenant separado para real y archivar fake, pero esta opcion tiene mas riesgo operativo.

## Fase 0 - Preparacion
1. Congelar cambios de schema mientras se hace la migracion.
2. Confirmar rama/codigo que se va a desplegar.
3. Confirmar variables de entorno destino:
   - `REACT_APP_SUPABASE_URL`
   - `REACT_APP_SUPABASE_ANON_KEY`
   - `REACT_APP_DATA_PROVIDER=supabase`
4. Confirmar acceso CLI:
```bash
npx supabase --version
npx supabase login
```

## Fase 1 - Backup obligatorio
Crear backup de schema y data antes de tocar destino:

```bash
npx supabase link --project-ref <PROJECT_REF>
npx supabase db dump --linked --schema public -f supabase/backups/<timestamp>_schema.sql
npx supabase db dump --linked --data-only --use-copy -f supabase/backups/<timestamp>_data.sql
```

Guardar tambien evidencia de historial de migraciones:

```sql
select version
from supabase_migrations.schema_migrations
order by version;
```

## Fase 2 - Salud de migraciones (baseline)
Antes de `db push`, revisar:

```bash
npx supabase migration list
```

Si hay drift (local != remote), no forzar `db push` ciego.

Ruta segura:
1. Corregir objetos conflictivos.
2. Usar `migration repair --status applied <version>` solo para versiones ya presentes en DB.
3. Re-ejecutar `migration list` hasta tener local y remote alineados.

## Fase 3 - Aplicar migraciones
Con baseline consistente:

```bash
npx supabase db push
npx supabase migration list
```

Resultado esperado:
- Todas las migraciones locales aparecen tambien en remote.

## Fase 4 - Hardening de seguridad
Validar hardening de funciones `SECURITY DEFINER`:
- Revisar guia: `docs/db-hardening-verification.md`

Checks minimos:
1. `search_path=public, pg_temp` en funciones criticas.
2. `anon` sin `EXECUTE` en RPCs sensibles.
3. `log_audit_event` sin `EXECUTE` para `anon/authenticated/service_role/public`.

## Fase 5 - Carga de datos reales
Principios:
1. Carga idempotente (upsert o llaves naturales).
2. Orden de carga respetando FK:
   - tenants/profiles
   - regiones/canales/subterritorios/pdvs
   - campanias/materiales/materiales_por_canal
3. Nunca sobreescribir data historica sin respaldo.

Checklist de carga:
1. Validar conteos por tabla.
2. Validar llaves foraneas sin huerfanos.
3. Validar que usuarios reales tengan `profile.tenant_id` correcto.

## Fase 6 - Validacion funcional y de seguridad
Smoke funcional minimo:
1. Login invalido muestra error controlado.
2. Login valido entra a home.
3. Crear solicitud con item.
4. Listar/filtrar solicitudes.
5. Exportar datos.

Smoke seguridad minimo:
1. Usuario no accede data de otro tenant.
2. RPC sensible denegada para `anon`.
3. RLS activo en tablas de negocio.

## Fase 7 - Cutover
1. Apuntar frontend al proyecto real (variables de entorno).
2. Desplegar.
3. Monitorear 24-48h:
   - errores de auth
   - errores RPC
   - exportaciones
4. Mantener backup y plan de rollback listo.

## Rollback
Escenarios:
1. Falla de schema/migracion:
   - restaurar desde backup SQL.
   - revertir deploy de frontend.
2. Falla de data:
   - restaurar data-only backup.
3. Falla de permisos:
   - reaplicar hardening SQL y verificar con queries de seguridad.

## Go / No-Go (resumen)
Go solo si:
1. `migration list` alineado (local = remote).
2. Hardening verificado.
3. Smoke funcional y seguridad en verde.
4. Backup de schema y data guardado.

No-Go si:
1. Drift sin resolver.
2. `anon` con execute en RPC sensible.
3. RLS desalineado.
4. Sin backup verificable.

## Evidencia minima para PR/release
1. Salida de `migration list`.
2. Capturas/resultado SQL de hardening.
3. Ubicacion de backups generados.
4. Checklist smoke firmado.
