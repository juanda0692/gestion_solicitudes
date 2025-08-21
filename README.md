# Base de Destinatarios – Trade Marketing

Aplicación React que simula la gestión de solicitudes de material POP y actualización de puntos de venta (PDV) para equipos regionales. Los datos se manejan de forma local y normalizada para probar flujos sin un backend real.

## Requisitos y setup
- Node.js y npm
- Instalar dependencias: `npm install`
- Ejecutar en desarrollo: `npm start`
- Ejecutar pruebas: `npm test`
- Generar build de producción: `npm run build`
- Backend PHP disponible en `backend/public/index.php`
  - Servidor PHP: `php -S localhost:8000`
  - MySQL: `127.0.0.1:3307` (base `base_dest`, usuario `root`, contraseña `Bermudez2020*`)

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

## Importar ubicaciones desde Excel

La importación desde Excel es una **herramienta de administración** disponible solo en modo desarrollo y no forma parte del flujo estándar de la aplicación. Permite reemplazar la lista de regiones, subterritorios y PDVs sin modificar el código.

1. Abre el panel de ajustes de desarrollador y elige *Cargar ubicaciones*.
2. Selecciona un archivo `.xlsx`.
3. El Excel debe incluir tres hojas:
   - **Regions**: columnas `region_id` (opcional) y `region_name`.
   - **Subterritories**: `region_id`, `subterritory_id` (opcional), `subterritory_name`.
   - **PDVs**: `subterritory_id`, `pdv_id` (opcional), `pdv_name` y, de forma opcional,
     `city`, `address` y `contact` (o `contactName`/`contactPhone`).
     También se aceptan los nombres en camelCase (`id`, `name`, `regionId`, etc.).
4. Se mostrarán los errores de validación detectados. Si no hay errores se
   genera una vista previa normalizada.
5. Usa **Aplicar en la app** para persistir el dataset en `localStorage` o
   descarga el resultado como `locations.json` o `locations.js`.
6. Si los datos quedan corruptos puedes utilizar el panel de desarrollador para
   restablecer las claves `locations_*` en el navegador.

## Limitaciones actuales
- No existe backend real; se usan mocks y `localStorage`.
- Posibles diferencias menores de formato según canal.
- Las exportaciones JSON son opcionales y están deshabilitadas por defecto.

## Siguientes pasos
- Conexión con Google Sheets o backend real.
- Pruebas end-to-end.
- Control de roles de usuario.
