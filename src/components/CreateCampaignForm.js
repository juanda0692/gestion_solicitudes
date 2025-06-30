import React, { useState } from 'react';
import { campaigns } from '../mock/campaigns';

const CreateCampaignForm = ({ onBack }) => {
  const [name, setName] = useState('');
  const handleSubmit = () => {
    const newCampaign = { id: `camp-${Date.now()}`, name };
    localStorage.setItem('campaigns', JSON.stringify([...(JSON.parse(localStorage.getItem('campaigns')) || campaigns), newCampaign]));
    onBack();
  };
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Crear campaña</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre de la campaña"
        className="w-full mb-4 bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none"
      />
      <div className="space-y-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all"
        >
          Guardar
        </button>
        <button
          onClick={onBack}
          className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-gray-600 transition-all"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default CreateCampaignForm;
