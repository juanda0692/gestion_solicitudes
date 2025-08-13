import React from 'react';
import { getStorageItem } from '../utils/storage';
import HistoryList from './history/HistoryList';
import { adaptMaterialRequests, adaptPdvUpdates, buildPdvIdMap } from '../utils/historyAdapter';
import { getActiveLocations } from '../utils/locationsSource';
import { channels } from '../mock/channels';

const ChannelRequests = ({ channelId, onBack }) => {
  const { regions, subterritories, pdvs } = getActiveLocations();
  const idMap = buildPdvIdMap(pdvs, regions, subterritories);
  const materialRequests = (getStorageItem('material-requests') || []).filter(
    (req) => req.channelId === channelId,
  );
  const pdvIds = new Set(materialRequests.map((r) => r.pdvId));
  const updateRequests = (getStorageItem('pdv-update-requests') || []).filter(
    (u) => u.channelId === channelId || pdvIds.has(u.pdvId),
  );

  const requests = adaptMaterialRequests(materialRequests, { idMap });
  const updates = adaptPdvUpdates(updateRequests, { idMap });
  const channelName = channels.find((c) => c.id === channelId)?.name || channelId;

  return (
    <HistoryList
      scope="canal"
      title={`Solicitudes para ${channelName}`}
      requests={requests}
      updates={updates}
      onBack={onBack}
      context={{ canal: channelName }}
    />
  );
};

export default ChannelRequests;

