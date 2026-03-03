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
- `startExport(filters)` devuelve `{ rows, fileName }`
- `getExportJob(id)` queda deprecated fuera del flujo interactivo

## Regla
- `fakeProvider` y `supabaseProvider` deben devolver estructuras equivalentes.
