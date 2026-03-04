import React from 'react';
import NacionalPlaceholder from '../assets/NacionalPlaceholder';
import RegionalPlaceholder from '../assets/RegionalPlaceholder';
import TigoLogo from '../assets/TigoLogo';

const HomeMenu = ({ onSelectTrade }) => {
  const today = new Date().toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full max-w-5xl mx-auto ui-card overflow-hidden">
      <div className="text-center px-5 py-6 sm:py-7 space-y-2">
        <TigoLogo className="h-12 mx-auto" />
        <h2 className="ui-title text-2xl sm:text-3xl">Base de destinatarios</h2>
        <p className="text-sm text-slate-500 capitalize">{today}</p>
        <p className="ui-subtitle max-w-2xl mx-auto">
          Gestiona solicitudes de material POP para puntos de venta en Trade Nacional y Trade Regional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[18rem]">
        <div className="relative">
          <NacionalPlaceholder className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/30 flex flex-col items-center justify-center px-6 text-center gap-4">
            <h3 className="text-white text-xl font-semibold tracking-wide">Trade Nacional</h3>
            <button type="button" onClick={() => onSelectTrade('nacional')} className="ui-btn max-w-[14rem] bg-white text-tigo-blue hover:bg-slate-100 border border-white/70">
              Ingresar
            </button>
          </div>
        </div>

        <div className="relative">
          <RegionalPlaceholder className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/30 flex flex-col items-center justify-center px-6 text-center gap-4">
            <h3 className="text-white text-xl font-semibold tracking-wide">Trade Regional</h3>
            <button type="button" onClick={() => onSelectTrade('regional')} className="ui-btn max-w-[14rem] bg-white text-tigo-blue hover:bg-slate-100 border border-white/70">
              Ingresar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMenu;
