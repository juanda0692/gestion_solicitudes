import { getRegions, getChannels, getSubterritories, getPdvs } from './api';

// Regiones válidas para Trade Nacional
const VALID_REGIONS = ['Sur', 'Andina', 'Bogota', 'Costa'];

/**
 * Obtiene las regiones disponibles.
 *
 * En modo demo utiliza LocalStorage. Si se configura API_BASE
 * en los servicios generales, reutiliza esa fuente de datos.
 */
export async function fetchRegions() {
  const regions = await getRegions();
  // Filtrar solo las regiones válidas
  return regions.filter((r) => VALID_REGIONS.includes(r.name));
}

/**
 * Obtiene los canales disponibles.
 */
export function fetchChannels() {
  return getChannels();
}

/**
 * Devuelve los PDVs para una región y canal determinados.
 *
 * @param {string} regionId
 * @param {string} [channelId]
 * @returns {Promise<Array>} Lista de PDVs completos
 */
export async function fetchPdvsByRegionAndChannel(regionId, channelId) {
  if (!regionId) return [];
  // Obtener subterritorios de la región
  const subs = await getSubterritories(regionId);
  const subMap = Object.fromEntries(subs.map((s) => [s.id, s.name]));
  // Obtener PDVs de todos los subterritorios
  const pdvLists = await Promise.all(subs.map((s) => getPdvs(s.id)));
  let allPdvs = pdvLists
    .flat()
    .filter((p) => p.complete)
    .map((p) => ({ ...p, subterritoryName: subMap[p.subterritoryId] || '' }));

  // TODO backend: filtrar PDVs por canal cuando el modelo lo soporte
  if (channelId) {
    // Actualmente no hay relación PDV-canal en el modo demo
  }

  return allPdvs;
}

export default {
  fetchRegions,
  fetchChannels,
  fetchPdvsByRegionAndChannel,
};
