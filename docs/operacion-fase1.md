# Guia Operativa Fase 1 (MVP)

## Objetivo
Operacion diaria del MVP para crear, consultar y exportar solicitudes sin usar flujos legacy.

## Prerrequisitos
- `REACT_APP_DATA_PROVIDER=supabase` para validacion real.
- Variables `REACT_APP_SUPABASE_URL` y `REACT_APP_SUPABASE_ANON_KEY` definidas.
- Usuario con `profile` y `tenant_id` valido en Supabase.

## Flujo operativo
1. Iniciar sesion.
2. Seleccionar trade y canal.
3. Seleccionar region, subterritorio y PDV.
4. Crear solicitud con al menos un item.
5. Confirmar pantalla de exito.
6. Consultar historial y aplicar filtros.
7. Exportar a XLSX desde flujo RPC directo.

## Reglas de datos
- Campo oficial de campania: `campania_id`.
- No usar aliases legacy con `n` tildada o mojibake en nuevas integraciones.
- Toda solicitud debe incluir `pdv_id`, `canal_id` e `items[]`.

## Operacion de export
- Flujo activo: `Frontend -> rpc_export_dataset -> workbook XLSX local`.
- No depende de Edge Function para export interactivo.
- Si no hay filas para los filtros, mostrar mensaje y no generar archivo.

## Seguridad operativa minima
- Mantener RLS activo en tablas de negocio.
- No habilitar permisos `EXECUTE` a `anon` en RPCs sensibles.
- No loggear payloads de negocio en consola de frontend productivo.
- Si se usa Edge legacy, configurar `EDGE_ALLOWED_ORIGINS` con allowlist explicita.

## Alcance validable en modo fake/staging
Lo que se puede validar bien:
1. Flujo de navegacion y formularios.
2. Contrato funcional de crear/listar/exportar.
3. Manejo de errores de UI y estados de carga.

Lo que queda parcial hasta usar data y usuarios reales:
1. Matriz de permisos por rol en casos denegados.
2. Aislamiento multi-tenant real bajo carga operativa.
3. Calidad de catalogos reales y casos de borde de negocio.

## Riesgos residuales hasta tener usuarios reales
1. Falsos positivos de autorizacion si solo se prueba con un rol.
2. Filtros que pasan en fake pero fallan con datos incompletos reales.
3. Regresiones de performance no detectadas por bajo volumen en staging.

Mitigacion minima antes de release productivo:
1. Ejecutar pruebas allow/deny/cross-tenant.
2. Validar export con volumen real y filtros reales.
3. Confirmar politicas RLS y grants SQL en entorno destino.
