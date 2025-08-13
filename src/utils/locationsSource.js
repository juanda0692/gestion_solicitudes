import { regions as bundledRegions, subterritories as bundledSubs, pdvs as bundledPdvs } from '../mock/locations';
import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

const LS_KEY_DATA = 'locations/imported';
const LS_KEY_SOURCE = 'locations/source';

export function getActiveLocations() {
  const imported = getStorageItem(LS_KEY_DATA);
  const source = getStorageItem(LS_KEY_SOURCE);

  const hasImported =
    imported &&
    imported.regions?.length &&
    Object.keys(imported.subterritories || {}).length &&
    Object.keys(imported.pdvs || {}).length;

  if (source === 'imported' && hasImported) {
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
    importedAt: null,
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
  setStorageItem(LS_KEY_SOURCE, 'imported');
  return clean;
}

export function clearImportedLocations() {
  removeStorageItem(LS_KEY_DATA);
  setStorageItem(LS_KEY_SOURCE, 'bundled');
}

export function getLocationsSource() {
  return getStorageItem(LS_KEY_SOURCE) || 'bundled';
}

