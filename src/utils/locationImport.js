import * as XLSX from 'xlsx';
import { normalizeLocationData } from './locationNormalizer';
import { setLocationsNormalized } from './locationsRuntime';
import { setStorageItem } from './storage';

// Utilidad simple para generar slugs
const slugify = (str = '') =>
  str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');

/**
 * Lee un archivo Excel y devuelve estructuras crudas.
 * @param {File} file
 * @returns {Promise<{rawRegions:Array,rawSubterritories:Array,rawPdvs:Array,issues:Array}>}
 */
export const parseExcel = async (file) => {
  const data = await file.arrayBuffer();
  const wb = XLSX.read(data, { type: 'array' });
  const sheetToJson = (name) =>
    XLSX.utils.sheet_to_json(wb.Sheets[name] || {}, { defval: '' });

  const rawRegions = sheetToJson('Regions').map((r) => ({
    id: r.id ? String(r.id) : '',
    name: String(r.name || ''),
  }));

  const rawSubterritories = sheetToJson('Subterritories').map((s) => ({
    id: s.id ? String(s.id) : '',
    name: String(s.name || ''),
    regionId: String(s.regionId || ''),
  }));

  const rawPdvs = sheetToJson('PDVs').map((p) => ({
    id: p.id ? String(p.id) : '',
    name: String(p.name || ''),
    subterritoryId: String(p.subterritoryId || ''),
    city: String(p.city || ''),
    address: String(p.address || ''),
    contactName: String(p.contactName || ''),
    contactPhone: String(p.contactPhone || ''),
    notes: String(p.notes || ''),
  }));

  return { rawRegions, rawSubterritories, rawPdvs, issues: [] };
};

/**
 * Valida las estructuras crudas importadas del Excel.
 * @returns {{errors:Array,warnings:Array}}
 */
export const validateRawData = (rawRegions = [], rawSubterritories = [], rawPdvs = []) => {
  const errors = [];
  const warnings = [];

  const regionIds = new Set();
  rawRegions.forEach((r, idx) => {
    if (!r.name) errors.push(`Region fila ${idx + 2}: nombre obligatorio`);
    if (r.id) {
      if (regionIds.has(r.id)) errors.push(`Region fila ${idx + 2}: id duplicado ${r.id}`);
      regionIds.add(r.id);
    } else warnings.push(`Region fila ${idx + 2}: id faltante`);
  });

  const subIds = new Set();
  rawSubterritories.forEach((s, idx) => {
    if (!s.name) errors.push(`Subterritorio fila ${idx + 2}: nombre obligatorio`);
    if (!s.regionId || (!regionIds.has(s.regionId)))
      errors.push(`Subterritorio fila ${idx + 2}: regionId inexistente`);
    if (s.id) {
      if (subIds.has(s.id)) errors.push(`Subterritorio fila ${idx + 2}: id duplicado ${s.id}`);
      subIds.add(s.id);
    } else warnings.push(`Subterritorio fila ${idx + 2}: id faltante`);
  });

  const pdvIds = new Set();
  rawPdvs.forEach((p, idx) => {
    ['name', 'city', 'address', 'contactName', 'contactPhone', 'subterritoryId'].forEach((f) => {
      if (!p[f]) errors.push(`PDV fila ${idx + 2}: ${f} obligatorio`);
    });
    if (!subIds.has(p.subterritoryId)) errors.push(`PDV fila ${idx + 2}: subterritoryId inexistente`);
    if (p.id) {
      if (pdvIds.has(p.id)) warnings.push(`PDV fila ${idx + 2}: id duplicado ${p.id}`);
      pdvIds.add(p.id);
    } else warnings.push(`PDV fila ${idx + 2}: id faltante`);
  });

  return { errors, warnings };
};

/**
 * Convierte un dataset normalizado a contenido JavaScript listo para guardar
 * como `locations.js`.
 */
export const toNormalizedJS = ({ regions, subterritories, pdvs }) => {
  return `import { validateNewPdv } from '../utils/locationNormalizer';\n\nexport const regions = ${JSON.stringify(
    regions,
    null,
    2,
  )};\nexport const subterritories = ${JSON.stringify(
    subterritories,
    null,
    2,
  )};\nexport const pdvs = ${JSON.stringify(pdvs, null, 2)};\n\nexport { validateNewPdv };\n`;
};

/**
 * Dado un conjunto de datos crudos, devuelve la estructura normalizada y la
 * aplica a la app inmediatamente.
 */
export const buildNormalized = (raw) => {
  const { rawRegions = [], rawSubterritories = [], rawPdvs = [] } = raw || {};
  const subMap = {};
  rawSubterritories.forEach((s) => {
    if (!subMap[s.regionId]) subMap[s.regionId] = [];
    subMap[s.regionId].push({ id: s.id || slugify(s.name), name: s.name });
  });
  const pdvMap = {};
  rawPdvs.forEach((p) => {
    if (!pdvMap[p.subterritoryId]) pdvMap[p.subterritoryId] = [];
    pdvMap[p.subterritoryId].push({
      id: p.id || slugify(p.name),
      name: p.name,
      city: p.city,
      address: p.address,
      contactName: p.contactName,
      contactPhone: p.contactPhone,
      notes: p.notes,
    });
  });
  const regionList = rawRegions.map((r) => ({ id: r.id || slugify(r.name), name: r.name }));
  return normalizeLocationData(regionList, subMap, pdvMap);
};
export const applyNormalized = (raw) => {
  const normalized = buildNormalized(raw);
  setLocationsNormalized(normalized);
  setStorageItem('normalization_report', { idMap: {}, duplicatesRemoved: [], warnings: [] });
  return normalized;
};

export default { parseExcel, validateRawData, toNormalizedJS, applyNormalized, buildNormalized };
