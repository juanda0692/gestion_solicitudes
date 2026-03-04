import React, { useEffect, useState } from 'react';
import { getChannels } from '../services/api';

/**
 * Menu principal de un canal.
 */
const ChannelMenu = ({ channelId, onSelectPdv, onViewRequests, canViewRequests = true }) => {
  const [channelName, setChannelName] = useState(channelId);

  useEffect(() => {
    getChannels()
      .then((list) => {
        setChannelName(list.find((c) => c.id === channelId)?.name || channelId);
      })
      .catch(console.error);
  }, [channelId]);

  return (
    <div className="ui-card p-6 sm:p-7 max-w-xl w-full mx-auto text-center">
      <h2 className="ui-title text-3xl mb-2">{channelName}</h2>
      <p className="ui-subtitle mb-6">Selecciona una accion para continuar</p>
      <div className="space-y-3">
        <button type="button" onClick={onSelectPdv} className="ui-btn ui-btn-primary">
          Gestionar solicitudes
        </button>
        <button
          type="button"
          onClick={onViewRequests}
          disabled={!canViewRequests}
          title={!canViewRequests ? 'Disponible proximamente' : undefined}
          className={`ui-btn ${canViewRequests ? 'ui-btn-secondary' : 'ui-btn-disabled'}`}
        >
          Ver solicitudes del canal
        </button>
      </div>
    </div>
  );
};

export default ChannelMenu;
