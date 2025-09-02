import { getStorageItem, setStorageItem } from './storage';
import { channels } from '../mock/channels';
import { materials } from '../mock/materials';
import { channelMaterials } from '../mock/channelMaterials';
import { campaigns } from '../mock/campaigns';
import { regions, subterritories, pdvs } from '../mock/locationsNormalized';

/**
 * Carga inicial de datos de demostración en LocalStorage.
 *
 * Si las claves correspondientes no existen, se rellenan con los
 * mocks incluidos en el proyecto. Estos registros sirven como
 * sustitutos temporales de la base de datos hasta que el backend
 * real esté disponible.
 */
// Ajusta datos anteriores en LocalStorage a la estructura actual del demo.
// TODO backend: esta migración no será necesaria cuando los catálogos provengan de la API.
function migrateLegacyLocations() {
  const storedRegions = getStorageItem('regions');
  const storedSubs = getStorageItem('subterritories');
  const storedPdvs = getStorageItem('pdvs');

  if (!storedRegions || !storedSubs || !storedPdvs) return;

  let changed = false;
  const removedPdvIds = [];

  const desiredNames = {
    'region-bogota': 'Bogota',
    'region-sur': 'Sur',
    'region-costa': 'Costa',
    'region-andina': 'Andina',
  };

  const newRegions = storedRegions
    .filter((r) => {
      if (r.id === 'region-centro') {
        changed = true;
        return false;
      }
      return true;
    })
    .map((r) => {
      const desired = desiredNames[r.id];
      if (desired && r.name !== desired) {
        changed = true;
        return { ...r, name: desired };
      }
      return r;
    });

  const subs = { ...storedSubs };
  const pdvMap = { ...storedPdvs };

  if (subs['region-centro']) {
    subs['region-centro'].forEach((s) => {
      (pdvMap[s.id] || []).forEach((p) => removedPdvIds.push(p.id));
      delete pdvMap[s.id];
    });
    delete subs['region-centro'];
    changed = true;
  }

  (subs['region-bogota'] || []).forEach((s) => {
    if (s.name.includes('Bogotá')) {
      s.name = s.name.replace('Bogotá', 'Bogota');
      changed = true;
    }
  });

  Object.keys(pdvMap).forEach((subId) => {
    pdvMap[subId] = (pdvMap[subId] || []).map((p) => {
      if (p.name.includes('Bogotá')) {
        changed = true;
        return { ...p, name: p.name.replace('Bogotá', 'Bogota') };
      }
      return p;
    });
  });

  if (changed) {
    setStorageItem('regions', newRegions);
    setStorageItem('subterritories', subs);
    setStorageItem('pdvs', pdvMap);

    ['material-requests', 'pdv-update-requests'].forEach((k) => {
      const arr = getStorageItem(k) || [];
      const filtered = arr.filter((e) => !removedPdvIds.includes(e.pdvId));
      setStorageItem(k, filtered);
    });
  }
}

export function bootstrapDemoData() {
  migrateLegacyLocations();
  const seed = (key, value) => {
    if (getStorageItem(key) == null) {
      setStorageItem(key, value);
    }
  };
  seed('channels', channels);
  seed('materials', materials);
  seed('channelMaterials', channelMaterials);
  seed('campaigns', campaigns);
  seed('regions', regions);
  seed('subterritories', subterritories);
  seed('pdvs', pdvs);
}

export default bootstrapDemoData;
