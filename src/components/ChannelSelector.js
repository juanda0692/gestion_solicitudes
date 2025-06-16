import React from 'react';
import { channels } from '../mock/channels';

const ChannelSelector = ({ onSelectChannel }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Selecciona un Canal</h2>
      <div className="grid grid-cols-1 gap-4">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onSelectChannel(channel.id)}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {channel.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChannelSelector;