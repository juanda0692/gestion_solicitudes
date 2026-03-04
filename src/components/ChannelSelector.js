import React, { useEffect, useState } from 'react';
import { getChannels } from '../services/api';

/**
 * Selector de canal.
 *
 * `channels` contiene datos simulados. Al integrar con backend,
 * este componente debería solicitar la lista de canales desde un
 * servicio y reemplazar la importación de mock.
 */

// `onSelectChannel` cambia la vista al menú del canal seleccionado.
// `onCreateCampaign` y `onExportData` son opcionales y permiten acceder
// directamente a la creación de campañas o a la exportación de datos.
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
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Selecciona un Canal</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* TODO backend: obtener canales desde API real */}
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className="h-24 bg-white border border-gray-200 rounded-lg shadow-md flex items-center justify-center text-lg font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
          >
            {channel.name}
          </button>
        ))}
      </div>
      {(showCreateCampaign || onExportData) && (
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          {showCreateCampaign && (
            <button
              onClick={onCreateCampaign}
              disabled={!canCreateCampaign}
              title={!canCreateCampaign ? 'Disponible proximamente' : undefined}
              className={`w-full text-white py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
                canCreateCampaign
                  ? 'bg-indigo-500 hover:bg-indigo-600 transform hover:scale-105'
                  : 'bg-indigo-300 cursor-not-allowed opacity-70'
              }`}
            >
              Crear campaña
            </button>
          )}
          {onExportData && (
            <button
              onClick={onExportData}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Exportar Datos
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ChannelSelector;
