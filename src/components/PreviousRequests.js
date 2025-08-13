import React from 'react';
import { getStorageItem } from '../utils/storage';
import HistoryList from './history/HistoryList';
import { adaptMaterialRequests, adaptPdvUpdates, buildPdvIdMap } from '../utils/historyAdapter';
import { regions, subterritories, pdvs } from '../mock/locations';

const idMap = buildPdvIdMap(pdvs, regions, subterritories);

const PreviousRequests = ({ pdvId, onBack }) => {
  const materialRequests = (getStorageItem('material-requests') || []).filter(
    (req) => req.pdvId === pdvId,
  );
  const updateRequests = (getStorageItem('pdv-update-requests') || []).filter(
    (req) => req.pdvId === pdvId,
  );

  const requests = adaptMaterialRequests(materialRequests, { idMap });
  const updates = adaptPdvUpdates(updateRequests, { idMap });
  const info = idMap[pdvId] || {};

  return (
    <HistoryList
      scope="pdv"
      title="Solicitudes del PDV"
      requests={requests}
      updates={updates}
      onBack={onBack}
      context={{
        pdvId,
        pdvName: info.pdvName,
        region: info.region,
        subterritory: info.subterritory,
      }}
    />
  );
};

export default PreviousRequests;

