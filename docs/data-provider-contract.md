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

### Payload canonico `createSolicitud`
- `client_request_id`
- `region_id`
- `subterritorio_id`
- `pdv_id`
- `canal_id`
- `campania_id`
- `prioridad`
- `zonas`
- `observaciones`
- `items[]`

Notas:
- Campo oficial de campania: `campania_id`.
- Aliases legacy con `n` tildada o mojibake solo se aceptan como compatibilidad temporal.

## Exports
- `startExport(filters)` devuelve `{ rows, fileName }`
- `getExportJob(id)` queda deprecated fuera del flujo interactivo

## Regla
- `fakeProvider` y `supabaseProvider` deben devolver estructuras equivalentes.
