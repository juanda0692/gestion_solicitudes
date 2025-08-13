import * as XLSX from 'xlsx';
import { getStorageItem } from './storage';
import { getDisplayName, formatQuantity } from './materialDisplay';

/**
 * Exporta un objeto de solicitud de materiales a un archivo Excel (.xlsx).
 * Cada combinación de PDV y material se convierte en una fila del archivo.
 *
 * @param {Object} exportObj - Objeto estructurado con la información a exportar
 */
export default function exportToExcel(exportObj) {
  try {
    if (!exportObj || !Array.isArray(exportObj.pdvs)) {
      return false;
    }

    const headers = [
      'Fecha',
      'Tipo',
      'Canal',
      'Región',
      'Subterritorio',
      'PDV',
      'Material',
      'Medida',
      'Cantidad',
      'Zonas',
      'Prioridad',
      'Campaña',
      'Contacto (PDV)',
      'Teléfono (PDV)',
      'Ciudad (PDV)',
      'Dirección (PDV)',
      'Notas internas (PDV)',
    ];

    const rows = [];
    exportObj.pdvs.forEach((pdv) => {
      const zone = Array.isArray(pdv.zone) ? pdv.zone.join(', ') : pdv.zone || '';
      const campaigns = Array.isArray(pdv.campaigns)
        ? pdv.campaigns.join(', ')
        : pdv.campaigns || '';
      const data = pdv.pdvData || getStorageItem(`pdv-${pdv.id}-data`) || {};
      const contactName = data.contactName || '';
      const contactPhone = data.contactPhone || '';
      const city = data.city || '';
      const address = data.address || '';
      const notes = data.notes || '';
      const mats = Array.isArray(pdv.materials) ? pdv.materials : [];
      mats.forEach((mat) => {
        rows.push({
          Fecha: pdv.date || '',
          Tipo: pdv.requestType || '',
          Canal: exportObj.channelName || '',
          Región: pdv.regionName || '',
          Subterritorio: pdv.subterritoryName || '',
          PDV: pdv.name || '',
          Material: getDisplayName(mat.name),
          Medida: mat.measure || '',
          Cantidad: formatQuantity(mat.name, mat.quantity) || '',
          Zonas: zone,
          Prioridad: pdv.priority || '',
          Campaña: campaigns,
          'Contacto (PDV)': contactName,
          'Teléfono (PDV)': contactPhone,
          'Ciudad (PDV)': city,
          'Dirección (PDV)': address,
          'Notas internas (PDV)': notes,
        });
      });
    });

    if (rows.length === 0) {
      return false;
    }

    const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

    // Freeze header row
    worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };

    // Basic auto width
    worksheet['!cols'] = headers.map((h) => ({
      wch: Math.max(
        h.length,
        ...rows.map((r) => (r[h] ? r[h].toString().length : 0)),
      ) + 2,
    }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitud');

    const date = new Date().toISOString().split('T')[0];
    const scope = (exportObj.scope || 'General').replace(/\s+/g, '-');
    const filename = `Export_${scope}_${date}.xlsx`;
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (e) {
    console.error('Error generating Excel', e);
    return false;
  }
}
