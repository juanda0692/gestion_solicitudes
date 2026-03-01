import { dataProvider } from '../data';

function buildFilters({ pdvIds, canalId, regionName, channelName, filename }) {
  return {
    pdvIds,
    canal_id: canalId,
    fileName:
      filename ||
      `solicitudes_${(regionName || 'region').toLowerCase()}_${(channelName || 'canal').toLowerCase()}_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`,
  };
}

export default async function exportToExcel(exportObj) {
  const result = await dataProvider.exports.startExport(buildFilters(exportObj || {}));
  return Boolean(result);
}
