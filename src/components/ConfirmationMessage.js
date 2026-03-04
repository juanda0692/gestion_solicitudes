import React from 'react';

/**
 * Muestra un mensaje de confirmacion despues de enviar una solicitud o actualizacion.
 */
const ConfirmationMessage = ({
  message,
  onGoHome,
  onStayInChannel,
  onBackToPdv,
  pdvName,
}) => {
  return (
    <div className="ui-card p-6 sm:p-7 max-w-md w-full mx-auto mt-8 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-3">Exito</h2>
      <p className="text-slate-700 text-lg mb-6">{message}</p>
      <div className="space-y-3">
        {onStayInChannel && (
          <button type="button" onClick={onStayInChannel} className="ui-btn ui-btn-cyan">
            Volver al canal
          </button>
        )}
        {onBackToPdv && (
          <button type="button" onClick={onBackToPdv} className="ui-btn ui-btn-secondary">
            Volver al PDV {pdvName}
          </button>
        )}
        <button type="button" onClick={onGoHome} className="ui-btn ui-btn-primary">
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default ConfirmationMessage;
