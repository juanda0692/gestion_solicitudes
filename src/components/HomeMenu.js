import React from 'react';

const HomeMenu = ({ onSelectTrade }) => {
  const today = new Date().toLocaleDateString();
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-2xl mx-auto text-center space-y-6">
      <img src="/tigo-logo.svg" alt="Tigo" className="h-12 mx-auto" />
      <h2 className="text-3xl font-bold text-gray-800">Bienvenido</h2>
      <p className="text-sm text-gray-600">{today}</p>
      <div className="bg-tigo-light p-4 rounded-lg text-gray-800">
        <p className="font-semibold mb-2">Informe de la base de destinatarios</p>
        <p>Here podrá realizar solicitudes de material, campañas y consultar información clave para la gestión comercial. Este sistema fue creado para reducir errores en procesos de distribución y logística.</p>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => onSelectTrade('nacional')}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          TRADE NACIONAL
        </button>
        <button
          onClick={() => onSelectTrade('regional')}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          TRADE REGIONAL
        </button>
      </div>
    </div>
  );
};

export default HomeMenu;
