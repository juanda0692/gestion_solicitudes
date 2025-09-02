import * as XLSX from 'xlsx';

/**
 * Exporta un listado de PDVs a un archivo Excel.
 *
 * @param {Object} data
 * @param {string} data.regionName
 * @param {string} data.channelName
 * @param {Array} data.pdvs
 * @returns {boolean} true si se generó el archivo
 */
export default function exportPdvs(data = {}) {
  try {
    const { regionName = '', channelName = '', pdvs = [] } = data;
    const workbook = XLSX.utils.book_new();

    // Hoja 1: resumen
    const summary = [
      {
        region: regionName,
        channel: channelName,
        date: new Date().toISOString(),
        totalPdvs: pdvs.length,
      },
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(workbook, wsSummary, 'Resumen');

    // Hoja 2: detalle de PDVs
    const pdvRows = pdvs.map((p) => ({
      id: p.id,
      nombre: p.name,
      subterritorio: p.subterritoryName || '',
      region: p.regionName || regionName,
      canal: channelName,
    }));
    const wsPdvs = XLSX.utils.json_to_sheet(pdvRows);
    XLSX.utils.book_append_sheet(workbook, wsPdvs, 'PDVs');

    const date = new Date().toISOString().split('T')[0];
    const filename = `Export_PDVs_${date}.xlsx`;
    // TODO backend/export: reemplazar por exportación desde backend si aplica
    XLSX.writeFile(workbook, filename);
    return true;
  } catch (e) {
    console.error('Error exporting PDVs', e);
    return false;
  }
}
