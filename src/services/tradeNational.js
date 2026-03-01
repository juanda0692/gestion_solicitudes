import { getRegions, getChannels, getSubterritories, getPdvs } from './api';

export async function fetchRegions() {
  const raw = await getRegions();
  return raw.map((region) => ({ id: region.id, name: region.name ?? region.nombre }));
}

export async function fetchChannels() {
  const raw = await getChannels();
  return raw.map((channel) => ({ id: channel.id, name: channel.name ?? channel.nombre }));
}

export async function fetchPdvsByRegionAndChannel(regionId, channelId) {
  if (!regionId) return [];

  const subterritories = await getSubterritories(regionId);
  const subNames = Object.fromEntries(
    subterritories.map((subterritory) => [subterritory.id, subterritory.name ?? subterritory.nombre ?? '']),
  );

  const pdvPages = await Promise.all(
    subterritories.map((subterritory) => getPdvs(subterritory.id, { limit: 500 })),
  );

  const pdvs = pdvPages.flat().map((pdv) => ({
    ...pdv,
    id: String(pdv.id ?? pdv.pdv_id ?? pdv.codigo ?? ''),
    name: String(pdv.name ?? pdv.nombre ?? '(sin nombre)'),
    canal_id: String(pdv.canal_id ?? ''),
    subterritoryId: pdv.subterritoryId ?? pdv.subterritorio_id ?? '',
    subterritoryName: subNames[pdv.subterritoryId ?? pdv.subterritorio_id] || '',
  }));

  if (!channelId) return pdvs;
  return pdvs.filter((pdv) => !pdv.canal_id || pdv.canal_id === channelId);
}

export default {
  fetchRegions,
  fetchChannels,
  fetchPdvsByRegionAndChannel,
};
