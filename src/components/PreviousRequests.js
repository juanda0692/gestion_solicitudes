import React from 'react';
import { getStorageItem } from '../utils/storage';

/**
 * Muestra el historial de solicitudes de material y actualizaciones
 * guardadas en localStorage para un PDV concreto.
 *
 * Al conectar con el backend, se debería reemplazar la lectura de
 * localStorage por peticiones a la API.
 */

// `pdvId` identifica el punto de venta y `onBack` vuelve a la pantalla anterior
const PreviousRequests = ({ pdvId, onBack }) => {
  const materialRequests = getStorageItem('material-requests') || [];
  const updateRequests = getStorageItem('pdv-update-requests') || [];
  const pdvRequests = materialRequests.filter((req) => req.pdvId === pdvId);
  const pdvUpdates = updateRequests.filter((req) => req.pdvId === pdvId);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Solicitudes Anteriores</h2>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Solicitudes de Material</h3>
      {pdvRequests.length === 0 ? (
        <p className="text-gray-600 text-center mb-6">No hay solicitudes previas para este PDV.</p>
      ) : (
        <ul className="space-y-4 mb-6">
          {pdvRequests.map((req, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-800">Solicitud #{index + 1}</p>
              <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(req.date).toLocaleDateString()}</p>
              <ul className="ml-4 list-disc">
                {req.items.map((item) => (
                  <li key={item.id}>
                    {item.material.name} - {item.measures.name} x {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Actualizaciones de PDV</h3>
      {pdvUpdates.length === 0 ? (
        <p className="text-gray-600 text-center">No hay actualizaciones previas para este PDV.</p>
      ) : (
        <ul className="space-y-4">
          {pdvUpdates.map((update, index) => (
            <li key={index} className="bg-gray-50 p-3 rounded-lg shadow-sm">
              <p className="font-semibold text-gray-800">Actualización #{index + 1}</p>
              <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(update.date).toLocaleDateString()}</p>
              <ul className="ml-4 list-disc">
                <li>Nombre de Contacto: {update.data.contactName}</li>
                <li>Teléfono: {update.data.contactPhone}</li>
                <li>Dirección: {update.data.address}</li>
                {update.data.notes && <li>Notas: {update.data.notes}</li>}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onBack}
        className="w-full mt-6 bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Volver
      </button>
    </div>
  );
};

export default PreviousRequests;

