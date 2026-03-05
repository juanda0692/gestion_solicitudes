# Smoke Tests

## Fake mode
1. Configurar `REACT_APP_DATA_PROVIDER=fake`.
2. Iniciar sesion demo.
3. Cargar canales, regiones, subterritorios, PDVs, campanias y materiales.
4. Crear una solicitud con varios items.
5. Verificar que el historial `/requests` muestre la nueva solicitud.
6. Verificar detalle `/requests/:id`.
7. Ejecutar export y validar descarga XLSX.

## Supabase mode
1. Configurar `REACT_APP_DATA_PROVIDER=supabase`.
2. Definir `REACT_APP_SUPABASE_URL` y `REACT_APP_SUPABASE_ANON_KEY`.
3. Crear usuario y `profile` en Supabase.
4. Iniciar sesion real.
5. Crear solicitud.
6. Confirmar decremento de stock en `materiales_por_canal`.
7. Confirmar idempotencia reintentando el mismo `client_request_id`.
8. Ejecutar export via RPC `public.rpc_export_dataset(jsonb)` y validar descarga XLSX.
