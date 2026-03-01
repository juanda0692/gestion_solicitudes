# Data Provider Contract

## Auth
- `getSession()`
- `signIn({ username|email, password })`
- `signOut()`

## Catalogs
- `getRegiones()`
- `getSubterritorios(regionId)`
- `getPdvs(subterritorioId, { search, limit, offset })`
- `getCanales()`
- `getCampanias()`
- `getMaterialesPorCanal(canalId, { search, limit, offset })`

## Requests
- `createSolicitud(payload)`
- `listSolicitudes(filters)`
- `getSolicitudDetalle(id)`

## Exports
- `startExport(filters)`
- `getExportJob(id)`

## Regla
- `fakeProvider` y `supabaseProvider` deben devolver estructuras equivalentes.
