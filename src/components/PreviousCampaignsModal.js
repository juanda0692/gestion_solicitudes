import React, { useState } from 'react';
import { getStorageItem } from '../utils/storage';
import { campaigns as defaultCampaigns } from '../mock/campaigns';

const PreviousCampaignsModal = ({ pdvId, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const campaignsList = JSON.parse(localStorage.getItem('campaigns')) || defaultCampaigns;
  const requests = (getStorageItem('material-requests') || []).filter((r) => r.pdvId === pdvId);

  const filterByCampaignName = (req) => {
    if (!search) return true;
    const names = req.campaigns
      .map((cid) => campaignsList.find((c) => c.id === cid)?.name || cid)
      .join(' ');
    return names.toLowerCase().includes(search.toLowerCase());
  };

  const getCampaignNames = (req) =>
    req.campaigns
      .map((cid) => campaignsList.find((c) => c.id === cid)?.name || cid)
      .join(', ');

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4 overflow-y-auto max-h-[80vh]">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Campañas anteriores</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <input
          type="text"
          placeholder="Buscar campaña"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-2 bg-gray-100 border border-gray-300 py-1 px-2 rounded"
        />
        <div className="space-y-4">
          {requests.filter(filterByCampaignName).map((req, idx) => (
            <div key={idx} className="border p-2 rounded">
              <p className="text-sm text-gray-600">Fecha: {new Date(req.date).toLocaleDateString()}</p>
              <p className="font-semibold">Campañas: {getCampaignNames(req)}</p>
              <ul className="ml-4 list-disc text-sm">
                {req.items.map((it) => (
                  <li key={it.id}>
                    {it.material.name} - {it.measures.name} x {it.quantity}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onSelect(req)}
                className="mt-2 bg-tigo-blue text-white py-1 px-3 rounded text-sm hover:bg-[#00447e]"
              >
                Agregar al carrito
              </button>
            </div>
          ))}
          {requests.filter(filterByCampaignName).length === 0 && (
            <p className="text-sm text-gray-600">No se encontraron campañas.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviousCampaignsModal;
