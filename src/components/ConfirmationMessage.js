import React from 'react';

const ConfirmationMessage = ({ message, onGoHome }) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">¡Éxito!</h2>
      <p className="text-gray-700 text-lg mb-6">{message}</p>
      <button
        onClick={onGoHome}
        className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default ConfirmationMessage;