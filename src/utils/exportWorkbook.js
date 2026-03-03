import * as XLSX from 'xlsx';
import { sanitizeSpreadsheetValue } from '../data/providers/shared';

const REQUEST_HEADERS = [
  'Solicitud ID',
  'Fecha',
  'Estado',
  'Canal',
  'Region',
  'Subterritorio',
  'PDV ID',
  'PDV',
  'Campania',
  'Prioridad',
  'Solicitado por',
  'Observaciones',
  'Items count',
];

const ITEM_HEADERS = [
  'Solicitud ID',
  'Fecha',
  'PDV ID',
  'PDV',
  'Canal',
  'Material ID',
  'Material',
  'Cantidad',
  'Medida etiqueta',
  'Medida custom',
  'Observaciones item',
];

const safeValue = (value) => sanitizeSpreadsheetValue(value ?? '');

const normalizeDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().replace('T', ' ').slice(0, 16);
};

const buildRequestRows = (rows) => {
  const grouped = new Map();

  rows.forEach((row) => {
    const key = String(row.solicitud_id);
    if (!grouped.has(key)) {
      grouped.set(key, {
        'Solicitud ID': row.solicitud_id,
        Fecha: normalizeDate(row.created_at),
        Estado: row.status || '',
        Canal: safeValue(row.canal_name || row.canal_id || ''),
        Region: safeValue(row.region_name || row.region_id || ''),
        Subterritorio: safeValue(row.subterritorio_name || row.subterritorio_id || ''),
        'PDV ID': safeValue(row.pdv_id || ''),
        PDV: safeValue(row.pdv_name || ''),
        Campania: safeValue(row.campania_name || row.campania_id || ''),
        Prioridad: row.prioridad ?? '',
        'Solicitado por': safeValue(row.created_by_name || row.created_by || ''),
        Observaciones: safeValue(row.observaciones || ''),
        'Items count': 0,
      });
    }
    grouped.get(key)['Items count'] += 1;
  });

  return Array.from(grouped.values()).sort((left, right) =>
    String(right.Fecha).localeCompare(String(left.Fecha)),
  );
};

const buildItemRows = (rows) =>
  rows.map((row) => ({
    'Solicitud ID': row.solicitud_id,
    Fecha: normalizeDate(row.created_at),
    'PDV ID': safeValue(row.pdv_id || ''),
    PDV: safeValue(row.pdv_name || ''),
    Canal: safeValue(row.canal_name || row.canal_id || ''),
    'Material ID': safeValue(row.material_id || ''),
    Material: safeValue(row.material_name || ''),
    Cantidad: Number(row.cantidad || 0),
    'Medida etiqueta': safeValue(row.medida_etiqueta || ''),
    'Medida custom': safeValue(row.medida_custom || ''),
    'Observaciones item': safeValue(row.item_observaciones || row.observaciones || ''),
  }));

const buildCols = (headers, rows) =>
  headers.map((header) => {
    const maxDataWidth = rows.reduce((max, row) => Math.max(max, String(row[header] ?? '').length), header.length);
    return { wch: Math.min(Math.max(maxDataWidth + 2, 12), 40) };
  });

const applySheetLayout = (sheet, headers, rows) => {
  const nextSheet = sheet || {};
  nextSheet['!autofilter'] = {
    ref: `A1:${String.fromCharCode(64 + headers.length)}${Math.max(rows.length + 1, 2)}`,
  };
  nextSheet['!cols'] = buildCols(headers, rows);
  return nextSheet;
};

export const buildExportWorkbookData = (rows = []) => {
  const requestRows = buildRequestRows(rows);
  const itemRows = buildItemRows(rows);
  return { requestRows, itemRows };
};

export const downloadExportWorkbook = ({ rows = [], fileName }) => {
  const { requestRows, itemRows } = buildExportWorkbookData(rows);
  const workbook = XLSX.utils.book_new();

  const requestsSheet = XLSX.utils.json_to_sheet(requestRows, { header: REQUEST_HEADERS });
  const itemsSheet = XLSX.utils.json_to_sheet(itemRows, { header: ITEM_HEADERS });

  const normalizedRequestsSheet = applySheetLayout(requestsSheet, REQUEST_HEADERS, requestRows);
  const normalizedItemsSheet = applySheetLayout(itemsSheet, ITEM_HEADERS, itemRows);

  XLSX.utils.book_append_sheet(workbook, normalizedRequestsSheet, 'Solicitudes');
  XLSX.utils.book_append_sheet(workbook, normalizedItemsSheet, 'Items');
  XLSX.writeFile(workbook, fileName);

  return {
    ok: true,
    fileName,
    rows: itemRows.length,
    sheets: ['Solicitudes', 'Items'],
  };
};
