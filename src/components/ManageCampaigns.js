import React, { useState, useEffect } from 'react';
import { campaigns as defaultCampaigns } from '../mock/campaigns';

const ManageCampaigns = ({ onBack }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('campaigns'));
    setList(stored || defaultCampaigns);
  }, []);

  const handleDelete = (id) => {
    const updated = list.filter((c) => c.id !== id);
    setList(updated);
    localStorage.setItem('campaigns', JSON.stringify(updated));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Gestionar campañas</h2>
      {list.length === 0 ? (
        <p className="text-center text-gray-600">No hay campañas.</p>
      ) : (
        <ul className="space-y-2 mb-4">
          {list.map((c) => (
            <li key={c.id} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span>{c.name}</span>
              <button onClick={() => handleDelete(c.id)} className="text-red-500">Eliminar</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onBack} className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all">
        Volver
      </button>
    </div>
  );
};

export default ManageCampaigns;
