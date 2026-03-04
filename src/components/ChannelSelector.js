import React, { useEffect, useState } from 'react';
import { getChannels } from '../services/api';

/**
 * Selector de canal.
 */
const ChannelSelector = ({
  onSelectChannel,
  onCreateCampaign,
  onExportData,
  showCreateCampaign = false,
  canCreateCampaign = true,
}) => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    getChannels().then(setChannels).catch(console.error);
  }, []);

  return (
    <div className="ui-card p-5 sm:p-6 max-w-3xl w-full mx-auto">
      <h2 className="ui-title text-2xl mb-1 text-center">Selecciona un canal</h2>
      <p className="ui-subtitle mb-5 text-center">Elige el canal para continuar con la gestion de solicitudes</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {channels.map((channel) => (
          <button
            key={channel.id}
            type="button"
            onClick={() => onSelectChannel(channel.id)}
            className="h-24 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-lg font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 transition-colors"
          >
            {channel.name}
          </button>
        ))}
      </div>

      {(showCreateCampaign || onExportData) && (
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {showCreateCampaign && (
            <button
              type="button"
              onClick={onCreateCampaign}
              disabled={!canCreateCampaign}
              title={!canCreateCampaign ? 'Disponible proximamente' : undefined}
              className={`ui-btn ${canCreateCampaign ? 'ui-btn-primary' : 'ui-btn-disabled'}`}
            >
              Crear campana
            </button>
          )}
          {onExportData && (
            <button type="button" onClick={onExportData} className="ui-btn ui-btn-secondary">
              Exportar datos
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChannelSelector;
