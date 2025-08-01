import React, { useState } from 'react';
import { getStorageItem } from '../utils/storage';
import { channels } from '../mock/channels';
import { getDisplayName, formatQuantity } from '../utils/materialDisplay';

/**
 * Lista de solicitudes realizadas por canal.
 *
 * Los datos provienen de localStorage como ejemplo. Para la
 * integración real se deberá consultar el backend y obtener la
 * información filtrada por `channelId`.
 */

const ChannelRequests = ({ channelId, onBack }) => {
  const materialRequests = getStorageItem('material-requests') || [];
  const updateRequests = getStorageItem('pdv-update-requests') || [];
  const channelRequests = materialRequests.filter((req) => req.channelId === channelId);
  const pdvIds = new Set(channelRequests.map((r) => r.pdvId));
  const channelUpdates = updateRequests.filter(
    (u) => u.channelId === channelId || (!u.channelId && pdvIds.has(u.pdvId)),
  );
  const channelName = channels.find((c) => c.id === channelId)?.name || channelId;

  const [showMaterials, setShowMaterials] = useState(false);
  const [showUpdates, setShowUpdates] = useState(false);
  const [expandedMaterials, setExpandedMaterials] = useState({});
  const [expandedUpdates, setExpandedUpdates] = useState({});

  const toggleMaterialSection = () => setShowMaterials((prev) => !prev);
  const toggleUpdateSection = () => setShowUpdates((prev) => !prev);
  const toggleMaterialCard = (idx) =>
    setExpandedMaterials((prev) => ({ ...prev, [idx]: !prev[idx] }));
  const toggleUpdateCard = (idx) =>
    setExpandedUpdates((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="relative p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8 pb-24">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Solicitudes para {channelName}
      </h2>

      {/* Sección Solicitudes de Material */}
      <div className="mb-4">
        <button
          onClick={toggleMaterialSection}
          className="w-full flex justify-between items-center bg-gray-100 rounded-lg p-3"
        >
          <span className="font-semibold text-gray-800">Solicitudes de Material</span>
          <span className="text-xl">{showMaterials ? '−' : '+'}</span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${showMaterials ? 'max-h-[1000px] mt-3' : 'max-h-0'}`}>
          {channelRequests.length === 0 ? (
            <p className="text-gray-600 text-center mt-4">No hay solicitudes previas para este canal.</p>
          ) : (
            <ul className="space-y-4 mt-4">
              {channelRequests.map((req, index) => {
                const showAll = expandedMaterials[index];
                const items = showAll ? req.items : req.items.slice(0, 3);
                return (
                  <li key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <span className="mr-2 text-xl">📦</span>
                      <h4 className="font-semibold text-gray-800">PDV: {req.pdvId}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(req.date).toLocaleDateString()}</p>
                    <ul className="ml-6 list-disc">
                      {items.map((item) => (
                        <li key={item.id}>
                          {getDisplayName(item.material.name)} - {item.measures.name} ({formatQuantity(item.material.name, item.quantity)})
                        </li>
                      ))}
                    </ul>
                    {req.items.length > 3 && (
                      <button onClick={() => toggleMaterialCard(index)} className="text-sm text-tigo-blue mt-2">
                        {showAll ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Sección Actualizaciones de PDV */}
      <div className="mb-4">
        <button
          onClick={toggleUpdateSection}
          className="w-full flex justify-between items-center bg-gray-100 rounded-lg p-3"
        >
          <span className="font-semibold text-gray-800">Actualizaciones de PDV</span>
          <span className="text-xl">{showUpdates ? '−' : '+'}</span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${showUpdates ? 'max-h-[1000px] mt-3' : 'max-h-0'}`}>
          {channelUpdates.length === 0 ? (
            <p className="text-gray-600 text-center mt-4">No hay actualizaciones previas para este canal.</p>
          ) : (
            <ul className="space-y-4 mt-4">
              {channelUpdates.map((update, index) => {
                const fields = [
                  { label: 'Nombre de Contacto', value: update.data.contactName },
                  { label: 'Teléfono', value: update.data.contactPhone },
                  { label: 'Dirección', value: update.data.address },
                ];
                if (update.data.notes) fields.push({ label: 'Notas', value: update.data.notes });
                const showAllU = expandedUpdates[index];
                const itemsU = showAllU ? fields : fields.slice(0, 3);
                return (
                  <li key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                    <div className="flex items-center mb-2">
                      <span className="mr-2 text-xl">📝</span>
                      <h4 className="font-semibold text-gray-800">PDV: {update.pdvId}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(update.date).toLocaleDateString()}</p>
                    <ul className="ml-6 list-disc">
                      {itemsU.map((f, idx) => (
                        <li key={idx}>{f.label}: {f.value}</li>
                      ))}
                    </ul>
                    {fields.length > 3 && (
                      <button onClick={() => toggleUpdateCard(index)} className="text-sm text-tigo-blue mt-2">
                        {showAllU ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <button
        onClick={onBack}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Volver
      </button>
    </div>
  );
};

export default ChannelRequests;

