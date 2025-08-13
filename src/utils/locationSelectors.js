import memoize from 'lodash.memoize';
import { getActiveLocations } from './locationsSource';

/**
 * Devuelve la lista de PDVs para un subterritorio.
 * Se intenta resolver por ID, luego por nombre y finalmente
 * se retorna el primer subterritorio que contenga datos.
 */
export const pdvsForSub = memoize(
  (subKey) => {
    const { subterritories, pdvs } = getActiveLocations();

    let subId = subKey;
    let list = pdvs[subId];

    // Intentar resolver por nombre si no se encontró por ID
    if (!list) {
      const allSubs = Object.values(subterritories).flat();
      const match = allSubs.find((s) => s.name === subKey);
      if (match) {
        subId = match.id;
        list = pdvs[subId];
      }
    }

    // Fallback: primer subterritorio con datos
    if (!list || list.length === 0) {
      const firstId = Object.keys(pdvs).find((id) => (pdvs[id] || []).length > 0);
      list = firstId ? pdvs[firstId] : [];
    }

    return list || [];
  },
  (subKey) => {
    const { source, importedAt } = getActiveLocations();
    return `${subKey}|${source}|${importedAt || ''}`;
  },
);
