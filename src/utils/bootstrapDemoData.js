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
export function bootstrapDemoData() {
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
