import React from 'react';
import { channels } from '../mock/channels';

/**
 * Muestra un resumen del contexto desde el cual se realiza la solicitud.
 *
 * Este componente ayuda a que el usuario recuerde el PDV seleccionado,
 * el subterritorio, la región y el canal actual mientras revisa el carrito.
 */
const ContextInfo = ({ pdvName, subterritoryName, regionName, channelId }) => {
  const channelName = channels.find((c) => c.id === channelId)?.name || channelId;
  return (
    <div className="mb-4 bg-tigo-light p-3 rounded-lg text-gray-800 text-sm">
      <p className="font-semibold">PDV: {pdvName}</p>
      <p>Subterritorio: {subterritoryName}</p>
      <p>Región: {regionName}</p>
      <p>Canal: {channelName}</p>
    </div>
  );
};

export default ContextInfo;
