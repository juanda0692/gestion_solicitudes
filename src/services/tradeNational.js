import { getRegions, getChannels, getSubterritories, getPdvs } from './api';

// Regiones válidas para Trade Nacional
const VALID_REGIONS = ['Sur', 'Andina', 'Bogota', 'Costa'];

/**
 * Obtiene las regiones disponibles.
 *
 * En modo demo utiliza LocalStorage. Si se configura API_BASE
 * en los servicios generales, reutiliza esa fuente de datos.
 */
// export async function fetchRegions() {
//   const regions = await getRegions();
//   // Filtrar solo las regiones válidas
//   return regions.filter((r) => VALID_REGIONS.includes(r.name));
// }

// /**
//  * Obtiene los canales disponibles.
//  */
// export function fetchChannels() {
//   return getChannels();
// }

export async function fetchRegions() {
  // … tu fetch …
  // supongamos que obtienes [{ id, nombre }] ó data: [...]
  const raw = await getRegions();
  return raw.map(r => ({ id: r.id, name: r.name ?? r.nombre }));
}

export async function fetchChannels() {
  const raw = await getChannels();
  return raw.map(c => ({ id: c.id, name: c.name ?? c.nombre }));
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

  const subs = await getSubterritories(regionId);
  const subMap = Object.fromEntries(
    subs.map((s) => [s.id, s.name ?? s.nombre ?? ''])
  );

  const pdvLists = await Promise.all(subs.map((s) => getPdvs(s.id)));

  // ❗Sin filtro por "complete" (porque no viene) + normalización durita
  const allPdvs = pdvLists.flat().map((p) => ({
    ...p,
    id: String(p.id ?? p.pdv_id ?? p.codigo ?? ''),           // ← siempre string
    name: String(p.name ?? p.nombre ?? '(sin nombre)'),       // ← siempre string
    subterritoryId: p.subterritoryId ?? p.subterritorio_id ?? '',
    subterritoryName: subMap[p.subterritoryId ?? p.subterritorio_id] || '',
  }));

  // De momento el canal no filtra PDVs
  return allPdvs;
}


export default {
  fetchRegions,
  fetchChannels,
  fetchPdvsByRegionAndChannel,
};
