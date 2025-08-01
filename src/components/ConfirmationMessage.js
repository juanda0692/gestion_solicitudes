import React from 'react';

/**
 * Muestra un mensaje de confirmación después de enviar una
 * solicitud o actualización. Al pulsar el botón se vuelve al
 * inicio de la aplicación.
 */

const ConfirmationMessage = ({
  message,
  onGoHome,
  onStayInChannel,
  onBackToPdv,
  pdvName,
}) => {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">¡Éxito!</h2>
      <p className="text-gray-700 text-lg mb-6">{message}</p>
      <div className="space-y-4">
        {onStayInChannel && (
          <button
            onClick={onStayInChannel}
            className="w-full bg-tigo-cyan text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00a7d6] transition-all"
          >
          Volver al Canal
          </button>
        )}
        {onBackToPdv && (
          <div>
            <button
              onClick={onBackToPdv}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg shadow hover:bg-gray-300"
            >
              Volver al PDV actual
            </button>
            <p className="mt-1 text-sm text-gray-600">{pdvName}</p>
          </div>
        )}
        <button
          onClick={onGoHome}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
