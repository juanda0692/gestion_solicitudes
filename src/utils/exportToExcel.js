import * as XLSX from 'xlsx';

/**
 * Exporta un objeto de solicitud de materiales a un archivo Excel (.xlsx).
 * Cada combinación de PDV y material se convierte en una fila del archivo.
 *
 * @param {Object} exportObj - Objeto estructurado con la información a exportar
 */
export default function exportToExcel(exportObj) {
  if (!exportObj || !Array.isArray(exportObj.pdvs)) {
    return;
  }

  // Definir columnas y generar filas
  const rows = [];
  exportObj.pdvs.forEach((pdv) => {
    const zone = Array.isArray(pdv.zone) ? pdv.zone.join(', ') : pdv.zone || '';
    const campaigns = Array.isArray(pdv.campaigns)
      ? pdv.campaigns.join(', ')
      : pdv.campaigns || '';
    pdv.materials.forEach((mat) => {
      rows.push({
        Fecha: exportObj.requestDate,
        'Tipo de solicitud': exportObj.type,
        Canal: exportObj.channelName,
        Región: pdv.regionName,
        Subterritorio: pdv.subterritoryName,
        PDV: pdv.name,
        Material: mat.name,
        Cantidad: mat.quantity || '',
        Medida: mat.measure || '',
        '¿Cotizable?': mat.requiresCotizacion ? 'Sí' : 'No',
        Zona: zone,
        Prioridad: pdv.priority || '',
        Campaña: campaigns,
        Observaciones: mat.observations || '',
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitud');

  const timestamp = new Date().toISOString();
  const filename = `Solicitud_Material_${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
