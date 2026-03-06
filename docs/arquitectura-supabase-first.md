# Arquitectura Supabase-First

## Runtime productivo
- Frontend: React SPA.
- Backend: Supabase para Auth, DB, views, RPC y RLS.
- Exportaciones interactivas: XLSX directo en navegador usando dataset de Supabase.
- Jobs asincronos futuros: opcionales, fuera del flujo interactivo.

## Modos soportados
- `fake`: usa `fakeProvider`, auth demo local, catalogos seed en `localStorage`, creacion de solicitud con idempotencia y decremento de stock simulado.
- `supabase`: usa `supabaseProvider`, Auth real y vistas/RPCs de Supabase.

## Principios
- No se exponen secretos en el frontend.
- CRUD sensible solo via RPC o Edge Function.
- RLS protege lecturas por tenant.
- n8n no forma parte del flujo interactivo de export.

## Capas frontend
- `src/data/`: providers y seleccion por flag.
- `src/services/`: wrappers compatibles con los componentes actuales.
- `src/components/` y `src/pages/`: UI actual adaptada al nuevo contrato.

## Integraciones opcionales
- `n8n` queda fuera del flujo interactivo actual.
- `supabase/functions/export-start/index.js` queda como legado o integracion futura, no como camino principal del frontend actual.

## Backend legado
- El backend PHP queda descartado para el runtime productivo.
- No debe volver a conectarse desde la SPA.

## Impacto de nuevos roles por capa
Agregar roles (`requester`, `approver`, `admin`) no rompe el diseno base, pero exige cambios coordinados:

1. Frontend
- Habilitar/deshabilitar acciones por rol para UX.
- Mantener claro que este gating es solo visual.

2. Services y providers
- Mantener contratos estables sin hardcode de rol en componentes.
- Estandarizar manejo de `401/403` para evitar estados inconsistentes.

3. Supabase (fuente de autorizacion real)
- Actualizar politicas RLS por rol y por tenant.
- Ajustar `GRANT/REVOKE EXECUTE` en RPCs sensibles.
- Revisar funciones `SECURITY DEFINER` con `search_path` defensivo.

4. QA y operacion
- Agregar pruebas automatizadas allow/deny/cross-tenant.
- Ejecutar smoke de authz en cada release.

Regla de arquitectura:
- La seguridad efectiva vive en Supabase (RLS + permisos SQL), no en la UI.
