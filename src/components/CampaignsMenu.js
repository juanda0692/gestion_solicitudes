import React from 'react';

const CampaignsMenu = ({ onCreate, onManage }) => (
  <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Campañas</h2>
    <div className="space-y-4">
      <button
        onClick={onCreate}
        className="w-full bg-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Crear campaña
      </button>
      <button
        onClick={onManage}
        className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Gestionar campañas
      </button>
    </div>
  </div>
);

export default CampaignsMenu;
