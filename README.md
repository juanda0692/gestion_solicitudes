# Sistema de Solicitudes Tigo

Aplicacion React para gestionar solicitudes de materiales POP con arquitectura `Supabase-first`.

## Stack activo
- Frontend: React SPA
- Datos y autenticacion: Supabase
- Exportaciones interactivas: XLSX directo en navegador
- Modo demo: `fakeProvider` con `localStorage`

## Modos de ejecucion
- `REACT_APP_DATA_PROVIDER=fake`
  - datos fake
  - auth demo local
  - export local
- `REACT_APP_DATA_PROVIDER=supabase`
  - auth real
  - catalogos, historial y solicitudes sobre views/RPCs de Supabase
  - export directo usando `rpc_export_dataset`

## Variables de entorno requeridas
- `REACT_APP_DATA_PROVIDER`
- `REACT_APP_ENABLE_DEMO_AUTH`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_APP_ENV`

No se requiere `REACT_APP_EXPORT_MODE` para el flujo actual.

## Comandos
```bash
npm start
npm run build
npm test -- --runInBand src/__tests__/exportBuild.spec.js
```

## Supabase
- Migracion principal: `supabase/migrations/20260228170000_supabase_first.sql`
- Migracion incremental de medidas: `supabase/migrations/20260228200000_add_material_medida_estandar.sql`
- Migracion de export directo: `supabase/migrations/20260302120000_export_direct_xlsx.sql`
- Seed demo: `supabase/seed.sql`

## Export interactivo
- El flujo activo es `Frontend -> Supabase RPC -> XLSX en navegador`.
- La funcion usada por el frontend es `public.rpc_export_dataset(jsonb)`.
- La vista soporte es `public.v_solicitudes_export`.
- `supabase/functions/export-start/index.ts` queda como codigo legado y no forma parte del flujo interactivo actual.

## Documentacion
- `docs/arquitectura-supabase-first.md`
- `docs/data-provider-contract.md`
- `docs/naming.md`
- `docs/smoke-tests.md`

## Notas
- El backend PHP no forma parte del runtime objetivo.
- No deben exponerse secretos ni tokens internos al frontend.
- `n8n` no es necesario para la exportacion interactiva.
