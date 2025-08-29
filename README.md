# Base de Destinatarios – Gestión de Material POP

Aplicativo de referencia para Trade Marketing. Backend PHP + MySQL y frontend React.

## Arquitectura
- PHP API (backend/public/index.php)
- React frontend (`src/`)
- MySQL 8 (esquema `base_dest`)

## Requisitos
- PHP 8+
- MySQL/MariaDB
- Node.js 18+
- (Opcional) Docker & docker compose

## Setup
### 1. Variables de entorno
Copiar `.env.example` → `.env` para el backend y `web/.env.example` → `web/.env` para el frontend.

### 2. Base de datos
- Dump completo:
  ```bash
  mariadb -uroot -pBermudez2020* --host 127.0.0.1 --port 3307 < docs/sql/base_destinatarios_import_final.sql
  ```
- Migraciones + seeds:
  ```bash
  mariadb -uroot -pBermudez2020* --host 127.0.0.1 --port 3307 base_dest < docs/sql/migrations/0001_init.sql
  mariadb -uroot -pBermudez2020* --host 127.0.0.1 --port 3307 base_dest < docs/sql/seeds/0001_bootstrap.sql
  ```

### 3. Backend
```bash
php -S localhost:8000 backend/router.php
```
Flags en `backend/public/index.php`:
- `$STRICT_VALIDATE` – valida FKs (lanza `validation_error`).
- `$DECREMENT_STOCK` – descuenta stock global.

### 4. Frontend
```bash
npm install
npm start
```
La API se toma de `import.meta.env.VITE_API` o `process.env.REACT_APP_API` (fallback `http://localhost:8000/api`).

### 5. Postman
Colección y environment finales en `docs/postman/`.
```bash
npx newman run docs/postman/BaseDestinatarios.final.postman_collection.json -e docs/postman/BaseDestinatarios.local.final.postman_environment.json
```

### 6. Docker (opcional)
```bash
docker compose up -d
```
Levanta MySQL (3307) y PHP (8000).

## API
Límite de payload: 1MB (HTTP 413 si se excede).
Paginación: `limit` (1–100), `offset` (>=0). Filtros: `region_id`, `subterritorio_id`, `pdv_id`, `campaña_id`. Orden: `id DESC`.
Tiempo en UTC.

| Método | Ruta | Descripción |
| ------ | ---- | ----------- |
| GET | `/health` | Estado del servicio |
| GET | `/regions` | Catálogo de regiones |
| GET | `/subterritories` | Catálogo de subterritorios |
| GET | `/pdvs` | Puntos de venta |
| GET | `/channels` | Canales |
| GET | `/channels/{id}/materials` | Materiales por canal |
| GET | `/materials` | Catálogo de materiales |
| GET | `/campaigns` | Campañas |
| POST | `/requests` | Crear solicitud |
| GET | `/requests` | Listar solicitudes |
| GET | `/requests/{id}` | Obtener solicitud |

## Troubleshooting
- Página en blanco → revisar logs en `backend/storage/logs/app.log`.
- CORS → editar `Access-Control-Allow-Origin` en `backend/public/index.php`.
- Error SQL 1064 → confirmar importación de base y puerto 3307.
- Para producción: no usar root/puerto público, desactivar debug, realizar backups.

## Próximos pasos
- Exportación a Excel
- Autenticación/roles y CORS restringido
- Logs estructurados y despliegue real

## ER Diagram
Archivo DBML en `docs/er/base_dest.dbml` (exportar a PNG con dbdiagram).

