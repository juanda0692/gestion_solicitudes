# Sistema de Solicitudes POP

Aplicacion React para gestion de solicitudes y exportaciones, con arquitectura `Supabase-first`.

## Stack activo
- Frontend: React SPA
- Datos y autenticacion: Supabase
- Exportaciones interactivas: XLSX directo en navegador
- Modo demo: `fakeProvider` con `localStorage`
- Runtime actual sin API PHP/MySQL local.

## Modos de ejecucion
- `REACT_APP_DATA_PROVIDER=fake`
  - datos mock
  - autenticacion demo local
  - export local
- `REACT_APP_DATA_PROVIDER=supabase`
  - autenticacion real
  - catalogos, historial y solicitudes sobre views/RPCs de Supabase
  - export directo usando `rpc_export_dataset`

## Variables de entorno requeridas
- `REACT_APP_DATA_PROVIDER`
- `REACT_APP_ENABLE_DEMO_AUTH`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_APP_ENV`

Variables opcionales:
- `EDGE_ALLOWED_ORIGINS` solo si se usa la Edge Function legacy `supabase/functions/export-start`.

## Comandos
```bash
npm start
npm run build
npm test
```

## Estructura del repositorio
- `src/`
  - UI, paginas y flujo de navegacion
  - providers (`fake` y `supabase`)
  - servicios y utilidades de negocio
- `supabase/`
  - `migrations/`: migraciones versionadas aplicables por CLI
  - `functions/`: Edge Functions y utilidades compartidas
  - `seed.sql`: datos seed para ambientes de prueba
  - `Supabase-*.sql`: scripts SQL de referencia/manuales movidos desde root
- `docs/`
  - arquitectura, contratos, smoke tests y guias operativas
- `.github/workflows/`
  - pipeline CI (tests + build)

## Supabase (archivos clave)
- `supabase/migrations/20260228170000_supabase_first.sql`
- `supabase/migrations/20260228200000_add_material_medida_estandar.sql`
- `supabase/migrations/20260302120000_export_direct_xlsx.sql`
- `supabase/migrations/20260305110000_harden_security_definer.sql`
- `supabase/seed.sql`

## Export interactivo
- Flujo activo: `Frontend -> Supabase RPC -> XLSX en navegador`.
- Funcion usada por frontend: `public.rpc_export_dataset(jsonb)`.
- Vista soporte: `public.v_solicitudes_export`.
- `supabase/functions/export-start/index.js` se mantiene como legado/integracion opcional.

## Documentacion relevante
- `docs/arquitectura-supabase-first.md`
- `docs/data-provider-contract.md`
- `docs/naming.md`
- `docs/smoke-tests.md`
- `docs/operacion-fase1.md`
- `docs/uat-checklist-fase1.md`
- `docs/db-hardening-verification.md`
- `docs/supabase-safe-migration-fake-to-real.md`
