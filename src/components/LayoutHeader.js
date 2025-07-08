import React from 'react';

/**
 * Encabezado común de la aplicación.
 * Muestra el logo de Tigo y un botón de retroceso cuando
 * `onBack` está definido.
 */

const LayoutHeader = ({ title, onBack, onLogout }) => {
  return (
    <header className="bg-tigo-blue text-white p-4 shadow-md flex items-center">
      <img src="/tigo-logo.svg" alt="Tigo Logo" className="h-8 w-auto mr-4" />
      {onBack && (
        <button onClick={onBack} className="text-white text-2xl mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
      )}
      <h1 className="text-xl md:text-2xl font-semibold flex-grow text-center">{title}</h1>
      {onLogout && (
        <button onClick={onLogout} className="ml-4 text-white text-sm">Cerrar sesión</button>
      )}
    </header>
  );
};

export default LayoutHeader;

