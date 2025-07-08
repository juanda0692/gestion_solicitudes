import React from 'react';
import { channels } from '../mock/channels';

/**
 * Selector de canal.
 *
 * `channels` contiene datos simulados. Al integrar con backend,
 * este componente debería solicitar la lista de canales desde un
 * servicio y reemplazar la importación de mock.
 */

// `onSelectChannel` cambia la vista al menú del canal seleccionado.
const ChannelSelector = ({ onSelectChannel }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Selecciona un Canal</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Reemplazar `channels` por datos obtenidos desde la API */}
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
    </div>
  );
};

export default ChannelSelector;
