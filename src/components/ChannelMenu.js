import React, { useEffect, useState } from 'react';
import { getChannels } from '../services/api';

/**
 * Menú principal de un canal.
 *
 * Desde aquí se puede continuar con la selección de PDV o
 * consultar el historial de solicitudes del canal.
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
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{channelName}</h2>
      <div className="space-y-4">
        <button
          onClick={onSelectPdv}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Gestionar Solicitudes
        </button>
        <button
          onClick={onViewRequests}
          disabled={!canViewRequests}
          title={!canViewRequests ? 'Disponible proximamente' : undefined}
          className={`w-full text-white py-3 px-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${
            canViewRequests
              ? 'bg-gray-500 hover:bg-gray-600 transform hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed opacity-70'
          }`}
        >
          Ver Solicitudes del Canal
        </button>
      </div>
    </div>
  );
};

export default ChannelMenu;
