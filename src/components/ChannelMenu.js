import React from 'react';
import { channels } from '../mock/channels';

/**
 * Menú principal de un canal.
 *
 * Desde aquí se puede continuar con la selección de PDV o
 * consultar el historial de solicitudes del canal.
 */
const ChannelMenu = ({ channelId, onSelectPdv, onViewRequests }) => {
  const channelName = channels.find((c) => c.id === channelId)?.name || channelId;

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
          className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Ver Solicitudes del Canal
        </button>
      </div>
    </div>
  );
};

export default ChannelMenu;
