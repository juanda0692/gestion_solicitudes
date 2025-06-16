import React from 'react';
import { getStorageItem } from '../utils/storage';
import { channels } from '../mock/channels';

const ChannelRequests = ({ channelId, onBack }) => {
  const requests = getStorageItem('material-requests') || [];
  const channelRequests = requests.filter((req) => req.channelId === channelId);
  const channelName = channels.find((c) => c.id === channelId)?.name || channelId;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Solicitudes para {channelName}
      </h2>
      {channelRequests.length === 0 ? (
        <p className="text-gray-600 text-center">No hay solicitudes previas para este canal.</p>
      ) : (
        <ul className="space-y-4">
          {channelRequests.map((req, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-800">PDV: {req.pdvId}</p>
              <ul className="ml-4 list-disc">
                {req.items.map((item) => (
                  <li key={item.id}>
                    {item.material.name} - {item.measures.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onBack}
        className="w-full mt-6 bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Volver
      </button>
    </div>
  );
};

export default ChannelRequests;
