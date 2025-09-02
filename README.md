Base de Destinatarios – Gestión de Material POP.

Aplicación web de referencia para gestionar solicitudes de material POP a nivel de Región → Subterritorio → Punto de Venta (PDV).
Su objetivo principal es centralizar y organizar la información de campo de manera visual, estructurada y usable por el área de Trade Marketing, sirviendo como puente entre las solicitudes de materiales físicos y la gestión logística posterior.

📌 Estado del Proyecto

Frontend (React):
100% operativo en modo demo, usando LocalStorage como base de datos simulada.
Incluye: selección jerárquica (regiones → subterritorios → PDVs), selección de campañas y materiales, creación de solicitudes y visualización en historial y detalle.

Backend (PHP + MySQL prototipo):
Implementación mínima de referencia, no productiva, usada solo para pruebas locales y definir los contratos de endpoints.

Documentación:

docs/openapi.yml → Especificación de la API.

docs/postman/ → Colección y environment Postman.

docs/sql/ → Volcado SQL completo, migraciones y seeds mínimas.

docs/er/ → Diagrama entidad–relación y diccionario de datos.

CHANGELOG.md → Cambios recientes registrados.

CODEMAP.md → (incluido) Estructura de carpetas y explicación de archivos clave.

Faltante / Próximos pasos:

Sustituir LocalStorage por API real.

Implementar autenticación y roles.

Mejorar seguridad (CORS restringido, logging estructurado, auditoría de accesos).

Despliegue en infraestructura corporativa con monitoreo y backups.

Exportación avanzada de solicitudes a Excel (stub listo en frontend).

🏗️ Arquitectura del repositorio

src/ → Frontend en React.

Modo demo: catálogos y solicitudes gestionados en LocalStorage.

Servicios y utils con marcadores claros // TODO backend para reemplazar por API.

backend/ → Prototipo PHP + MySQL.

Router simple (backend/router.php).

Endpoints básicos (/regions, /subterritories, /pdvs, /campaigns, /materials, /requests).

Solo para referencia / pruebas locales.

docs/ → Documentación.

OpenAPI, Postman, SQL, diagramas ER, diccionario de datos, QA manual.

🚀 Cómo ejecutar
1. Modo demo (sin API real)
npm install
npm start

Al iniciar, LocalStorage se alimenta automáticamente con los catálogos desde utils/bootstrapDemoData.

Los datos persisten en el navegador; para reiniciar, limpiar manualmente el almacenamiento del navegador.

Nota: los servicios tienen marcadores // TODO backend donde se sustituye LocalStorage por API real.

2. Modo con backend de referencia
   php -S localhost:8000 backend/router.php

Configurar VITE_API o REACT_APP_API con la URL del backend.

El frontend consumirá datos reales desde la API.

🌍 Datos incluidos

Regiones definitivas:

Sur

Andina

Bogota

Costa

(El proceso de migración elimina la región Centro y renombra “Bogotá” a “Bogota”).

Relación jerárquica:

Región → Subterritorio → PDV

Cada PDV asociado a campañas y materiales disponibles.

📡 Endpoints previstos

Documentados en docs/openapi.yml y colección Postman (docs/postman/).

En modo demo, se simulan con LocalStorage.

Ejemplos:

GET /regions

GET /regions/{id}/subterritories

GET /subterritories/{id}/pdvs

GET /channels/{id}/materials

POST /requests

GET /requests/{id}

🛠️ Roadmap y siguientes pasos

Integración de backend real

Implementar la API productiva respetando los endpoints documentados.

Sustituir el uso de LocalStorage en frontend por llamadas a la API.

Seguridad y autenticación

Autenticación de usuarios (JWT u otro estándar).

Roles (administrador, usuario, solo lectura).

Restricciones de CORS y auditoría de accesos.

Infraestructura y despliegue

Desplegar en servidor corporativo (con logs, monitoreo, backups).

Procesos CI/CD para mantener la aplicación.

Funcionalidades adicionales

Exportación avanzada a Excel (ya hay un stub en frontend).

Manejo de stock en tiempo real.

Actualización de PDVs y catálogos dinámicos desde backend.

🧰 Troubleshooting

Página en blanco (backend): revisar logs en backend/storage/logs/app.log.

Errores CORS: editar cabecera Access-Control-Allow-Origin en backend/public/index.php.

Datos inconsistentes: limpiar LocalStorage y reiniciar el demo.

API no responde: confirmar que php -S localhost:8000 backend/router.php está corriendo en el puerto correcto.

📑 Estado para entrega

Este repositorio está en estado prototipo funcional en demo:

Muestra el flujo completo del negocio (desde región → solicitud → historial → detalle).

Deja definido qué falta y cómo continuar.

Documentación actualizada para que la persona encargada del backend real pueda entrar sin perder tiempo y comenzar directamente la implementación productiva.
