# Base de Destinatarios – Gestión de Material POP

Aplicación de referencia para gestionar solicitudes de material POP a nivel de región → subterritorio → PDV.

## Estado

- **Frontend**: React operativo en modo demo usando LocalStorage.
- **Backend**: prototipo en PHP + MySQL como referencia.
- Falta: API real integrada, autenticación, seguridad, despliegue y exportación avanzada a Excel.

## Arquitectura

- `src/` – frontend React. En ausencia de API todas las lecturas/escrituras se hacen sobre `LocalStorage`.
- `backend/` – ejemplo de API PHP + MySQL.
- `docs/` – OpenAPI, diccionario de datos, diagramas ER y colección Postman.

## Cómo ejecutar

### Modo demo (sin API)

1. `npm install`
2. `npm start`
3. Al iniciar, `LocalStorage` se alimenta con los mocks (`utils/bootstrapDemoData`). Los datos persisten en el navegador; para reiniciar se puede limpiar el almacenamiento.
// TODO backend: reemplazar LocalStorage por la API real.

### Modo con API real

1. Levantar el backend: `php -S localhost:8000 backend/router.php`.
2. Definir la URL del API en la variable `VITE_API` o `REACT_APP_API`.
3. El frontend consumirá los catálogos y solicitudes desde el endpoint configurado.

## Datos

Regiones disponibles: **Sur**, **Andina**, **Bogota**, **Costa**.
La migración inicial elimina la región *Centro* y renombra "Bogotá" a "Bogota".

## Endpoints previstos

Documentados en `docs/openapi.yml` y en la colección Postman (`docs/postman/`).
En modo demo se simulan mediante `LocalStorage`.

## Roadmap

- Sustituir LocalStorage por API real.
- Autenticación, roles y CORS.
- Logging estructurado y despliegue.
- Exportación avanzada a Excel.

## Troubleshooting

- Página en blanco: revisar `backend/storage/logs/app.log`.
- Errores CORS: editar `Access-Control-Allow-Origin` en `backend/public/index.php`.
- Problemas con rutas o datos: limpiar `LocalStorage`.
