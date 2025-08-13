import { regions as bundledRegions, subterritories as bundledSubs, pdvs as bundledPdvs } from '../mock/locations';
import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

export const LS_KEY_DATA = 'locations/imported';
export const LS_KEY_SOURCE = 'locations/source';

// Helpers ---------------------------------------------------------------

/** Suma la cantidad total de subterritorios en el objeto provisto. */
export const countSubs = (subMap = {}) =>
  Object.values(subMap).reduce(
    (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
    0,
  );

/** Suma la cantidad total de PDVs en el objeto provisto. */
export const countPdvs = (pdvMap = {}) =>
  Object.values(pdvMap).reduce(
    (acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0),
    0,
  );

/**
 * Determina si un dataset importado contiene datos válidos.
 * Requiere al menos una región, subterritorio y PDV.
 */
export const hasImportedData = (imported) =>
  Boolean(
    imported &&
      imported.regions?.length > 0 &&
      countSubs(imported.subterritories) > 0 &&
      countPdvs(imported.pdvs) > 0,
  );

// API ------------------------------------------------------------------

export function getActiveLocations() {
  const imported = getStorageItem(LS_KEY_DATA);
  const source = getStorageItem(LS_KEY_SOURCE);

  if (source === 'imported' && hasImportedData(imported)) {
    return {
      regions: imported.regions,
      subterritories: imported.subterritories,
      pdvs: imported.pdvs,
      source: 'imported',
      importedAt: imported.importedAt,
    };
  }

  // fallback a bundled
  setStorageItem(LS_KEY_SOURCE, 'bundled');
  return {
    regions: bundledRegions,
    subterritories: bundledSubs,
    pdvs: bundledPdvs,
    source: 'bundled',
  };
}

export function setImportedLocations(payload) {
  // payload: { regions, subterritories, pdvs }
  const clean = {
    regions: payload?.regions || [],
    subterritories: payload?.subterritories || {},
    pdvs: payload?.pdvs || {},
    importedAt: new Date().toISOString(),
  };
  setStorageItem(LS_KEY_DATA, clean);
  if (hasImportedData(clean)) {
    setStorageItem(LS_KEY_SOURCE, 'imported');
  } else {
    // persist but no activar
    setStorageItem(LS_KEY_SOURCE, 'bundled');
  }
  return clean;
}

export function clearImportedLocations() {
  removeStorageItem(LS_KEY_DATA);
  setStorageItem(LS_KEY_SOURCE, 'bundled');
}

export function getLocationsSource() {
  return getStorageItem(LS_KEY_SOURCE) || 'bundled';
}

