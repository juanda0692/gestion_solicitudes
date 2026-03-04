import React from 'react';
import TigoLogo from '../assets/TigoLogo';

/**
 * Encabezado comun de la aplicacion.
 * Muestra el logo de Tigo y un boton de retroceso cuando `onBack` esta definido.
 */
const LayoutHeader = ({ title, onBack, onLogout, onLogoClick }) => {
  return (
    <header className="bg-tigo-blue text-white px-3 sm:px-5 py-3 shadow-md">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onLogoClick}
          disabled={!onLogoClick}
          aria-label="Ir a inicio"
          className={`ui-icon-btn p-1.5 ${onLogoClick ? '' : 'cursor-default opacity-70'}`}
        >
          <TigoLogo className="h-7 sm:h-8 w-auto" />
        </button>

        {onBack && (
          <button type="button" onClick={onBack} aria-label="Volver" className="ui-icon-btn p-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
        )}

        <h1 className="text-lg sm:text-2xl font-semibold flex-1 text-center truncate px-2">{title}</h1>

        {onLogout ? (
          <button
            type="button"
            onClick={onLogout}
            className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-md border border-white/30 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200"
          >
            Cerrar sesion
          </button>
        ) : (
          <div className="w-16 sm:w-24" aria-hidden />
        )}
      </div>
    </header>
  );
};

export default LayoutHeader;
