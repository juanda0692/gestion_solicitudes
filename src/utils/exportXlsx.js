import * as XLSX from 'xlsx';

export function exportRequestToXlsx({ id, regionName, subterritoryName, pdvName, items }) {
  const rows = [
    ['REGIÓN', regionName],
    ['SUBTERRITORIO', subterritoryName],
    ['PDV', pdvName],
    [],
    ['MATERIAL', 'MEDIDA', 'CANTIDAD', 'OBSERVACIONES'],
  ];
  items.forEach((it) =>
    rows.push([
      it.materialName,
      it.measureTag || it.measureCustom || '',
      it.quantity,
      it.observations || '',
    ]),
  );
  const ws = XLSX.utils.aoa_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Solicitud');
  XLSX.writeFile(wb, `Solicitud_${id}.xlsx`);
}
