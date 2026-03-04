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
- `supabase/functions/export-start/index.ts` queda como legado o integracion futura, no como camino principal del frontend actual.

## Backend legado
- El backend PHP queda descartado para el runtime productivo.
- No debe volver a conectarse desde la SPA.
