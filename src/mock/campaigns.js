// Campañas de ejemplo con prioridad, canales y materiales asignados.
// Estas estructuras se almacenan temporalmente en localStorage
// y pueden ser reemplazadas por datos provenientes de un backend.
export const campaigns = [
  {
    id: 'camp-1',
    name: 'Campaña Verano 2024',
    priority: '1',
    channels: ['tiendas', 'tigo-express'],
    materials: ['material-1', 'material-2'],
  },
  {
    id: 'camp-2',
    name: 'Promo Fin de Año',
    priority: '2',
    channels: ['dealer-home'],
    materials: ['material-3'],
  },
  {
    id: 'camp-3',
    name: 'Lanzamiento Producto X',
    priority: '3',
    channels: ['fvd-home', 'islas'],
    materials: ['material-4'],
  },
];
