import React from 'react';
import { channels } from '../mock/channels';

/**
 * Selector de canal.
 *
 * `channels` contiene datos simulados. Al integrar con backend,
 * este componente debería solicitar la lista de canales desde un
 * servicio y reemplazar la importación de mock.
 */

// `onSelectChannel` cambia la vista a la selección de ubicación.
// `onViewChannelRequests` muestra el historial de solicitudes por canal.
const ChannelSelector = ({ onSelectChannel, onViewChannelRequests }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Selecciona un Canal</h2>
      <div className="grid grid-cols-1 gap-4">
        {/* Reemplazar `channels` por datos obtenidos desde la API */}
        {channels.map((channel) => (
          <div key={channel.id} className="space-y-2">
            <button
              onClick={() => onSelectChannel(channel.id)}
              className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {channel.name}
            </button>
            {onViewChannelRequests && (
              <button
                onClick={() => onViewChannelRequests(channel.id)}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Ver Solicitudes
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelSelector;
