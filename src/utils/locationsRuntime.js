import { getStorageItem, setStorageItem, removeStorageItem } from './storage';
import { regions as mockRegions, subterritories as mockSubterritories, pdvs as mockPdvs, validateNewPdv } from '../mock/locations';

/**
 * Obtiene las ubicaciones disponibles. Si existen datos normalizados en
 * `localStorage` se devuelven, de lo contrario se usa el mock incluido en
 * el bundle.
 */
export const getLocations = () => {
  const stored = getStorageItem('locations_normalized');
  if (
    stored &&
    Array.isArray(stored.regions) &&
    stored.subterritories &&
    stored.pdvs
  ) {
    return stored;
  }
  return { regions: mockRegions, subterritories: mockSubterritories, pdvs: mockPdvs };
};

/**
 * Persiste un dataset normalizado en `localStorage` y marca el origen.
 * @param {{regions:Array,subterritories:Object,pdvs:Object}} dataset
 */
export const setLocationsNormalized = (dataset) => {
  if (!dataset) return;
  setStorageItem('locations_normalized', dataset);
  setStorageItem('locations_source', 'uploaded');
};

/**
 * Limpia los datos de ubicaciones cargados manualmente, regresando al
 * dataset por defecto.
 */
export const clearLocations = () => {
  removeStorageItem('locations_normalized');
  removeStorageItem('locations_source');
  removeStorageItem('normalization_report');
};

export { validateNewPdv };

export default { getLocations, setLocationsNormalized, clearLocations, validateNewPdv };
