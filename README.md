# Base de Destinatarios (Frontend)

Este proyecto es una demostración en React que simula el flujo de gestión de solicitudes de material POP y actualización de puntos de venta (PDV).

Actualmente todos los datos se encuentran en archivos **mock** y se persisten temporalmente en `localStorage` para efectos de pruebas. El objetivo de esta documentación es guiar a un desarrollador en la estructura del código y señalar dónde se deben conectar las APIs reales.

## Estructura principal

- **src/App.js** – Componente principal que maneja la navegación entre pantallas y controla el estado global.
- **src/components/** – Conjunto de componentes para cada vista (selección de canal, formularios, listados, etc.).
- **src/mock/** – Datos estáticos de ejemplo (canales, ubicaciones y materiales).
- **src/utils/storage.js** – Utilidades para leer y escribir en `localStorage`.

## Conexión con backend

1. **Carga de datos**: Los archivos de `src/mock` deben sustituirse por peticiones HTTP. Cada componente indica en sus comentarios dónde realizar esas llamadas.
2. **Envío de solicitudes**: Las funciones `handleConfirmRequest` y `handleUpdateConfirm` dentro de `App.js` son los puntos principales para enviar información al servidor.
3. **Históricos**: `PreviousRequests` y `ChannelRequests` leen datos del almacenamiento local; reemplazar por consultas al backend que filtren por PDV o canal.

## Puesta en marcha

```bash
npm install
npm start
```

La aplicación se iniciará en modo de desarrollo. A partir de este punto se pueden adaptar las funciones indicadas para conectarse a los servicios que provea el backend.

