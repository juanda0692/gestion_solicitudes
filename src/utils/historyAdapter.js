import { getDisplayName } from './materialDisplay';

// Build mapping of PDV IDs to normalized info
export const buildPdvIdMap = (pdvData = {}, regions = [], subterritories = {}) => {
  const regionMap = Object.fromEntries(regions.map((r) => [r.id, r.name]));
  const subMap = {};
  Object.entries(subterritories).forEach(([regionId, subs]) => {
    subs.forEach((s) => {
      subMap[s.id] = { name: s.name, regionId };
    });
  });

  const map = {};
  Object.entries(pdvData).forEach(([subId, list]) => {
    list.forEach((pdv) => {
      const regionId = pdv.regionId || subMap[subId]?.regionId;
      map[pdv.id] = {
        id: pdv.id,
        pdvName: pdv.name,
        region: regionMap[regionId] || regionId,
        subterritory: subMap[subId]?.name || pdv.subterritoryId,
      };
    });
  });
  return map;
};

export const adaptMaterialRequests = (raw = [], { idMap = {} } = {}) => {
  return raw.map((req, idx) => {
    const info = idMap[req.pdvId] || {};
    const snapshot = req.pdvSnapshot || req.pdvData;
    return {
      id: req.id || `req-${idx}`,
      date: req.date,
      type: 'SOLICITUD',
      canal: req.channelId || req.canal,
      region: info.region || req.region,
      subterritory: info.subterritory || req.subterritory,
      pdvId: info.id || req.pdvId,
      pdvName: info.pdvName || req.pdvName,
      pdvSnapshot: snapshot && Object.keys(snapshot).length ? snapshot : undefined,
      items: (req.items || []).map((item) => ({
        id: item.id || `${item.material?.id || item.rawName}-${Math.random()}`,
        displayName: item.displayName || getDisplayName(item.material?.name || item.rawName || ''),
        measure: item.measures?.name || item.measure || '',
        quantity: item.quantity,
        rawName: item.material?.name || item.rawName || '',
      })),
      campaign: req.campaign || (req.campaigns && req.campaigns[0]),
      zones: req.zones,
      priority: req.priority,
    };
  });
};

export const adaptPdvUpdates = (raw = [], { idMap = {} } = {}) => {
  return raw.map((up, idx) => {
    const info = idMap[up.pdvId] || {};
    return {
      id: up.id || `upd-${idx}`,
      date: up.date,
      type: 'ACTUALIZACIÓN_PDV',
      region: info.region || up.region,
      subterritory: info.subterritory || up.subterritory,
      pdvId: info.id || up.pdvId,
      pdvName: info.pdvName || up.pdvName,
      data: up.data || {},
    };
  });
};

