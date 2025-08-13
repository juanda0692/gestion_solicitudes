# Base de Destinatarios – Trade Marketing

Aplicación React que simula la gestión de solicitudes de material POP y actualización de puntos de venta (PDV) para equipos regionales. Los datos se manejan de forma local y normalizada para probar flujos sin un backend real.

## Requisitos y setup
- Node.js y npm
- Instalar dependencias: `npm install`
- Ejecutar en desarrollo: `npm start`
- Ejecutar pruebas: `npm test`
- Generar build de producción: `npm run build`

## Estructura
- **src/**: componentes React, utilidades y datos mock.
  - **components/**: pantallas, formularios, modales y elementos de UI.
  - **utils/**: normalizadores, exportadores y acceso centralizado a `localStorage`.
  - **mock/**: conjuntos de datos simulados que pasan por el normalizador.
- **public/**: archivos estáticos.
- **docs/**: documentación y guías de QA.

## Flujos clave
- **Selección jerárquica**: Canal → Región → Subterritorio → PDV.
- **Solicitar material**: validaciones, modal de confirmación y snapshot del PDV.
- **Actualizar PDV**: edición con reemplazo de datos predeterminados.
- **Historial PDV/Canal**: componente reusable con filtros en memoria.
- **Exportación**: por canal y personalizada; Excel incluye snapshot del PDV.
- **Datos y normalización**: se cargan en formato uniforme, `idMap` para ubicaciones y fallback de datos.
- **Limpieza y Panel Dev**: herramientas para migrar, limpiar y depurar datos locales.

## Cargar ubicaciones (Excel)

La opción **Cargar ubicaciones** (solo visible en desarrollo) permite reemplazar la
lista de regiones, subterritorios y PDVs sin necesidad de modificar el código.

1. En la barra lateral elija *Cargar ubicaciones* y seleccione un archivo `.xlsx`.
2. El Excel debe incluir tres hojas:
   - **Regions**: columnas `region_id` (opcional) y `region_name`.
   - **Subterritories**: `region_id`, `subterritory_id` (opcional), `subterritory_name`.
   - **PDVs**: `subterritory_id`, `pdv_id` (opcional), `pdv_name` y, de forma opcional,
     `city`, `address` y `contact` (o `contactName`/`contactPhone`).
     También se aceptan los nombres en camelCase (`id`, `name`, `regionId`, etc.).
3. Se mostrarán los errores de validación detectados. Si no hay errores se
   genera una vista previa normalizada.
4. Use **Aplicar en la app** para persistir el dataset en `localStorage` o
   descargue el resultado como `locations.json` o `locations.js`.
5. Si los datos quedan corruptos puede utilizar el panel de desarrollador para
   restablecer las claves `locations_*` en el navegador.

## Limitaciones actuales
- No existe backend real; se usan mocks y `localStorage`.
- Posibles diferencias menores de formato según canal.
- Las exportaciones JSON son opcionales y están deshabilitadas por defecto.

## Siguientes pasos
- Conexión con Google Sheets o backend real.
- Pruebas end-to-end.
- Control de roles de usuario.
