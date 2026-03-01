# Sistema de Solicitudes Tigo

Aplicacion React para gestionar solicitudes de materiales POP con arquitectura `Supabase-first`.

## Stack
- Frontend: React SPA
- Datos/Auth: Supabase
- Exportaciones y jobs: n8n
- Modo desarrollo/demo: `fakeProvider` con `localStorage`

## Modos de ejecucion
- `REACT_APP_DATA_PROVIDER=fake`: datos fake, auth demo, export local.
- `REACT_APP_DATA_PROVIDER=supabase`: Auth real, views/RPCs de Supabase y export via Edge Function.

## Variables clave
- `REACT_APP_DATA_PROVIDER`
- `REACT_APP_ENABLE_DEMO_AUTH`
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_EXPORT_MODE`

## Comandos
```bash
npm start
npm run build
```

## Supabase
- Migracion principal: `supabase/migrations/20260228170000_supabase_first.sql`
- Seed demo: `supabase/seed.sql`
- Edge Function de export: `supabase/functions/export-start/index.ts`

## Documentacion
- `docs/arquitectura-supabase-first.md`
- `docs/data-provider-contract.md`
- `docs/naming.md`
- `docs/smoke-tests.md`

## Notas
- El backend PHP fue retirado del runtime objetivo.
- No deben exponerse secretos ni tokens internos al frontend.
