import React from 'react';
import NacionalPlaceholder from '../assets/NacionalPlaceholder';
import RegionalPlaceholder from '../assets/RegionalPlaceholder';

const HomeMenu = ({ onSelectTrade }) => {
  const today = new Date().toLocaleDateString();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="text-center p-6 space-y-2">
        <img src="/tigo-logo.svg" alt="Tigo" className="h-12 mx-auto" />
        <h2 className="text-3xl font-bold text-gray-800">BASE DE DESTINATARIOS</h2>
        <p className="text-sm text-gray-600">{today}</p>
        <p className="text-gray-700 max-w-2xl mx-auto">
          Sistema para gestionar solicitudes de material POP y mantener actualizados los puntos de venta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 h-64">
        {/* Sección Trade Nacional */}
        <div className="relative">
          <NacionalPlaceholder className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-white text-xl font-semibold">TRADE NACIONAL</h3>
            <button
              onClick={() => onSelectTrade('nacional')}
              className="bg-white text-tigo-blue font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-100"
            >
              Ingresar
            </button>
          </div>
        </div>

        {/* Sección Trade Regional */}
        <div className="relative">
          <RegionalPlaceholder className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center space-y-4">
            <h3 className="text-white text-xl font-semibold">TRADE REGIONAL</h3>
            <button
              onClick={() => onSelectTrade('regional')}
              className="bg-white text-tigo-blue font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-100"
            >
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMenu;
