import React from 'react';

const LayoutHeader = ({ title, onBack }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg flex items-center justify-between">
      {onBack && (
        <button onClick={onBack} className="text-white text-2xl mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
      )}
      <h1 className="text-2xl font-bold flex-grow text-center">{title}</h1>
      <div className="w-6 h-6"></div> {/* Espaciador para centrar el título */}
    </header>
  );
};

export default LayoutHeader;