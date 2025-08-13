# Guion de pruebas para regionales

## 1. Preparación
- **Navegador recomendado:** Chrome o Firefox.
- Limpiar datos locales de la app o usar `Panel de Desarrollador → Restablecer datos locales`.
- Usar un usuario ficticio si aplica e ingresar por la pantalla de login inicial.

## 2. Flujo jerárquico (Canal → Región → Subterritorio → PDV)
1. Seleccionar un **Canal**.
2. Elegir una **Región** disponible.
3. Seleccionar un **Subterritorio** de la región.
4. Escoger un **PDV**.

**DoD:** no hay opciones vacías erróneas; el PDV muestra las acciones **Solicitar material**, **Actualizar PDV** y **Ver solicitudes**.

## 3. Solicitar material
1. Abrir *Solicitar material*.
2. Agregar dos ítems con medidas/cantidades válidas (uno debe ser "volantes").
3. Completar **Zonas**, **Prioridad** y **Campaña**.
4. Revisar el modal de confirmación: muestra ubicación, snapshot del PDV, carrito formateado y metadatos.
5. Confirmar.
6. Ver pantalla de confirmación con el botón “Volver al PDV {nombre}”.

**DoD:** validaciones antes del modal, snapshot guardado, reglas de display
(volantes → “X asesores”; TEND CARD/NPS → “Puesto de asesores (original)”) visibles.

## 4. Actualizar PDV
1. Abrir *Actualizar PDV*.
2. Editar datos requeridos y marcar **Guardar y establecer como datos predeterminados**.
3. Probar **Añadir nuevos datos**: debe obligar a marcar predeterminado o lanzar diálogo.
4. Confirmar y volver al PDV.

**DoD:** reemplazo inteligente de defaults similares (no duplica); modal de confirmación muestra cambios.

## 5. Historial (PDV)
1. En el PDV, abrir *Solicitudes anteriores*.
2. Probar acordeones, **ver más** y filtros por tipo, fecha y texto.

**DoD:** filtros aplican en memoria; snapshot del PDV presente en tarjetas.

## 6. Historial por Canal
1. Desde la vista de canal, pulsar *Ver solicitudes del canal*.

**DoD:** usa el mismo componente reusable, animaciones y filtros; muestra múltiples regiones.

## 7. Exportar datos
1. Desde canal, generar exportación directa a Excel.
2. Usar exportación personalizada: seleccionar Región/Subterritorio/PDV → *Mostrar resumen* → **Exportar**.
3. Abrir el archivo Excel generado y verificar columnas en orden fijo con encabezado congelado:
   1) Fecha 2) Tipo 3) Canal 4) Región 5) Subterritorio 6) PDV 7) Material 8) Medida 9) Cantidad 10) Zonas 11) Prioridad 12) Campaña 13) Contacto 14) Teléfono 15) Ciudad 16) Dirección 17) Notas.

**DoD:** bloquea export vacío con modal; nombre `Export_{scope}_{YYYY-MM-DD}.xlsx`;
materiales formateados correctos; usa snapshot de PDV (con fallback normalizado).

## 8. Limpieza y migración
1. Abrir *Panel de Desarrollador* → **Ejecutar limpieza**.
2. Revisar el resumen presentado.

**DoD:** no quedan huérfanos ni duplicados; el historial se preserva tras `idMap`.

## 9. Responsive y textos
1. Probar la interfaz a 1280px, 1024px y 390px de ancho.

**DoD:** sin roturas visuales y copys consistentes.

## 10. Registro de resultados
Usar una tabla simple para anotar “OK” u observaciones por sección.

