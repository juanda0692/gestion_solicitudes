# Changelog

## 2025-09-05
- Eliminado menú de ajustes y componentes asociados.
- Centralizado acceso a `LocalStorage` mediante utilidades.
- Documentación principal reescrita y limpieza de archivos huérfanos.

## 2025-09-02
- Integración de Utils con almacenamiento de demo.
- Regiones unificadas: Sur, Andina, Bogota y Costa (migración LocalStorage).
- Limpieza de archivos y datos de ejemplo.

## 2025-08-29
- Configuración .env y `backend/config.php` con fallback seguro.
- Limitación de payload y logging básico.
- Docker compose y Dockerfile opcional para dev.
- Makefile y scripts npm.
- Migraciones, seeds y documentación SQL.
- OpenAPI 3.0, diccionario de datos y diagrama ER.
- Postman final + instrucciones Newman.
- Ajustes frontend (RequestDetail, env configurable).
- README actualizado y entradas de errores.

## 2025-08-27
- Inicialización del backend.
- Creación de tablas y catálogos base.
- Adición de solicitudes (POST /requests, GET /requests, GET /requests/{id}).
- Alias bilingües para rutas principales.
- Correcciones en paginación y filtros.
- Implementación del front (servicios unificados, RequestsHistory, RequestDetail).
- Últimos ajustes y documentación final.
