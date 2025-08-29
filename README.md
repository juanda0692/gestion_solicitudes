# Base de Destinatarios – Gestión de Material POP

Aplicativo de referencia para gestionar solicitudes de material POP y el catálogo de puntos de venta de la compañía. Incluye un backend PHP + MySQL y un frontend React listos para ser extendidos por el equipo de desarrollo.

## Estado del proyecto
- **Backend**: API REST con PHP 8 y MySQL. Expuestos los endpoints principales (`/regions`, `/subterritories`, `/pdvs`, `/channels`, `/channels/{id}/materials`, `/materials`, `/campaigns`, `/requests`, `/requests/{id}`, `/health`).
- **Frontend**: vista de historial de solicitudes y componente para detalle individual. Servicios HTTP centralizados.
- **Base de datos**: se provee `base_destinatarios_final.sql` con catálogos y un par de solicitudes de ejemplo.

Pendiente: autenticación, exportaciones avanzadas, roles y mejoras de validación.

## Dependencias
- PHP 8+
- MySQL/MariaDB (configurado en `127.0.0.1:3307`)
- Node.js 18+ / npm
- Postman (opcional, colección en `docs/BaseDestinatarios.postman_collection.json`)

## Puesta en marcha
### 1. Importar base de datos
```bash
mariadb -uroot -pBermudez2020* --host 127.0.0.1 --port 3307 < base_destinatarios_final.sql
```
Contenido principal:
- **regiones**, **subterritorios**, **pdvs**
- **canales**, **materiales**, **campañas**, **materiales_por_canal**
- **solicitudes**, **solicitud_items** (con ejemplos)

### 2. Levantar backend
```bash
php -S localhost:8000 backend/router.php
```
Banderas disponibles dentro de `backend/public/index.php`:
- `$STRICT_VALIDATE`: valida FK al crear solicitudes.
- `$DECREMENT_STOCK`: descuenta del stock global de `materiales`.

### 3. Ejecutar frontend
```bash
npm install
npm run dev      # ó npm start
```
Abrir `http://localhost:3000` y navegar a **/requests** para ver el historial.

## Endpoints principales
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/health` | Estado del servicio y conexión a BD |
| GET | `/regions` (`/regiones`) | Catálogo de regiones |
| GET | `/subterritories` (`/subterritorios`) | Catálogo de subterritorios, filtro `region_id` opcional |
| GET | `/pdvs` | PDVs, filtro `subterritorio_id` opcional |
| GET | `/channels` (`/canales`) | Catálogo de canales |
| GET | `/channels/{id}/materials` | Materiales disponibles para un canal |
| GET | `/materials` (`/materiales`) | Catálogo general de materiales |
| GET | `/campaigns` (`/campanas`) | Catálogo de campañas |
| POST | `/requests` (`/solicitudes`) | Crear solicitud con items |
| GET | `/requests` | Listar solicitudes con `limit`/`offset` |
| GET | `/requests/{id}` | Obtener solicitud y sus items |

Ejemplo de creación de solicitud:
```bash
curl -X POST http://localhost:8000/api/requests \
  -H 'Content-Type: application/json' \
  -d '{
        "pdv_id":"pdv-001",
        "items":[{"material_id":"mat-afiche","cantidad":5}]
      }'
```

## Colección Postman
Importar `docs/BaseDestinatarios.postman_collection.json` y configurar la variable `base_url` (por defecto `http://localhost:8000/api`). La colección incluye ejemplos para todos los endpoints.

## Estructura relevante
- **backend/router.php** – enruta `/api` hacia `backend/public/index.php`.
- **backend/public/index.php** – implementación completa de la API.
- **src/services/api.js** – funciones de consumo HTTP.
- **src/pages/RequestsHistory.jsx** – listado paginado de solicitudes.
- **src/pages/RequestDetail.jsx** – visualización de una solicitud.

## Próximos pasos sugeridos
- Exportar resultados a Excel desde el front con [SheetJS](https://sheetjs.com/).
- Incorporar autenticación y manejo de roles.
- Validaciones de stock y claves foráneas más estrictas.
- Deploy en servidor real (Apache/Nginx + MySQL remoto).
