import { dataProvider } from '../data';

const mapRegion = (region) => ({
  id: region.id,
  name: region.name,
});

const mapSubterritory = (subterritory) => ({
  id: subterritory.id,
  region_id: subterritory.regionId || subterritory.region_id,
  name: subterritory.name,
});

const mapPdv = (pdv) => ({
  id: pdv.id,
  subterritorio_id: pdv.subterritorioId || pdv.subterritorio_id,
  canal_id: pdv.canalId || pdv.canal_id || '',
  name: pdv.name,
  codigo: pdv.code || pdv.codigo || pdv.id,
});

const mapChannel = (channel) => ({
  id: channel.id,
  name: channel.name,
});

const mapCampaign = (campaign) => ({
  id: campaign.id,
  name: campaign.name,
  prioridad: Number(campaign.priority || campaign.prioridad || 0),
  status: campaign.status || 'active',
});

const mapMaterial = (material) => ({
  id: material.materialId || material.material_id || material.id,
  material_id: material.materialId || material.material_id || material.id,
  canal_id: material.canalId || material.canal_id,
  name: material.name,
  description: material.description || material.descripcion || '',
  stock: Number(material.stock || 0),
  medida_estandar: material.medida_estandar || material.size || material.measures?.[0] || '',
  size: material.medida_estandar || material.size || material.measures?.[0] || '',
  measures: material.measures || [],
});

export async function http() {
  throw new Error('http helper deprecated. Usa DataProvider/Supabase RPC en su lugar.');
}

export const getRegions = async () => {
  const regions = await dataProvider.catalogs.getRegiones();
  return regions.map(mapRegion);
};

export const getSubterritories = async (regionId) => {
  const subterritories = await dataProvider.catalogs.getSubterritorios(regionId);
  return subterritories.map(mapSubterritory);
};

export const getPdvs = async (subId, options = {}) => {
  const result = await dataProvider.catalogs.getPdvs(subId, options);
  return (result.data || []).map(mapPdv);
};

export const getChannels = async () => {
  const channels = await dataProvider.catalogs.getCanales();
  return channels.map(mapChannel);
};

export const getMaterials = async () => {
  const channels = await dataProvider.catalogs.getCanales();
  const materials = await Promise.all(
    channels.map((channel) => dataProvider.catalogs.getMaterialesPorCanal(channel.id, { limit: 500 })),
  );
  const deduped = new Map();
  materials.flatMap((page) => page.data || []).forEach((material) => {
    deduped.set(material.materialId || material.material_id || material.id, mapMaterial(material));
  });
  return Array.from(deduped.values());
};

export const getMaterialsByChannel = async (channelId, options = {}) => {
  const result = await dataProvider.catalogs.getMaterialesPorCanal(channelId, options);
  return (result.data || []).map(mapMaterial);
};

export const getCampaigns = async () => {
  const campaigns = await dataProvider.catalogs.getCampanias();
  return campaigns.map(mapCampaign);
};
