# Arquitectura Supabase-First

## Runtime productivo
- Frontend: React SPA.
- Backend: Supabase para Auth, DB, views, RPC y RLS.
- Exportaciones y jobs: n8n.
- Gateway seguro para export: Supabase Edge Function.

## Modos soportados
- `fake`: usa `fakeProvider`, auth demo local, catálogos seed en `localStorage`, creación de solicitud con idempotencia y decremento de stock simulado.
- `supabase`: usa `supabaseProvider`, Auth real, vistas/RPCs y Edge gateway.

## Principios
- No se exponen secretos en el frontend.
- CRUD sensible solo vía RPC o Edge Function.
- RLS protege lecturas por tenant.
- n8n no es API CRUD.

## Capas frontend
- `src/data/`: providers y selección por flag.
- `src/services/`: wrappers compatibles con los componentes actuales.
- `src/components/` y `src/pages/`: UI actual adaptada al nuevo contrato.

## Backend legado
- El backend PHP queda descartado para el runtime productivo.
- No debe volver a conectarse desde la SPA.

