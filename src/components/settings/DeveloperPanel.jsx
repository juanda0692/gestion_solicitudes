import React, { useState } from 'react';
import { sanitizeOnBoot, resetAll } from '../../utils/cleanupLocalStorage';
import { getStorageItem } from '../../utils/storage';

import LocationDataLoader from '../LocationDataLoader';

import {
  getActiveLocations,
  getLocationsSource,
  setLocationsSource,
  hasImportedData,
  LS_KEY_DATA,
} from '../../utils/locationsSource';


/**
 * Panel de utilidades para desarrolladores.
 * Permite limpiar o restablecer datos almacenados en el navegador.
 */
const DeveloperPanel = ({ onBack, onLoadLocations }) => {
  const [result, setResult] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showLoader, setShowLoader] = useState(false);

  const [locSource, setLocSource] = useState(getLocationsSource());

  const getStats = () => {
    const requests = (getStorageItem('material-requests') || []).length;
    const updates = (getStorageItem('pdv-update-requests') || []).length;
    const pdvData = Object.keys(localStorage).filter((k) => /^pdv-.*-data$/.test(k)).length;
    const defaults = Object.keys(localStorage).filter((k) => /^pdv-.*-defaults-list$/.test(k)).length;
    return { requests, updates, pdvData, defaults };
  };

  const [stats, setStats] = useState(getStats());

  const handleCleanup = () => {
    const { pdvs } = getActiveLocations();
    const validIds = Object.values(pdvs)
      .flat()
      .filter((p) => p.complete)
      .map((p) => p.id);
    const res = sanitizeOnBoot(validIds);
    setResult(res);
    setStats(getStats());
  };

  const handleReset = () => {
    resetAll();
    window.location.reload();
  };


  if (showLoader) {
    return <LocationDataLoader onBack={() => setShowLoader(false)} />;
  }

  const importedValid = hasImportedData(getStorageItem(LS_KEY_DATA));
  const handleUseImported = () => {
    setLocSource(setLocationsSource('imported'));
  };
  const handleUseBundled = () => {
    setLocSource(setLocationsSource('bundled'));
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Estado actual</h2>
        <ul className="text-sm space-y-1">
          <li>Solicitudes: {stats.requests}</li>
          <li>Actualizaciones: {stats.updates}</li>
          <li>PDV data: {stats.pdvData}</li>
          <li>Defaults: {stats.defaults}</li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <button
          onClick={handleCleanup}
          className="bg-tigo-blue text-white px-4 py-2 rounded"
        >
          Ejecutar limpieza
        </button>
        {result && (
          <pre className="text-xs mt-2 bg-gray-100 p-2 rounded">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <p className="text-sm">Fuente actual: {locSource === 'imported' ? 'Importado' : 'Bundled'}</p>
        {importedValid && locSource !== 'imported' && (
          <button onClick={handleUseImported} className="bg-tigo-blue text-white px-4 py-2 rounded">
            Activar dataset importado
          </button>
        )}
        {locSource === 'imported' && (
          <button onClick={handleUseBundled} className="px-4 py-2 border rounded">
            Usar dataset base
          </button>
        )}
        {onLoadLocations && (
          <button onClick={onLoadLocations} className="px-4 py-2 border rounded">
            Cargar ubicaciones
          </button>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow space-y-2">
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Restablecer datos locales
        </button>
        {showConfirm && (
          <div className="mt-2 text-sm">
            <p className="mb-2">
              Se eliminarán las claves del proyecto en este navegador. ¿Continuar?
            </p>
            <div className="space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 border rounded"
              >
                Cancelar
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Sí, restablecer
              </button>
            </div>
          </div>
        )}
      </div>

      {process.env.NODE_ENV === 'development' && (
        <div className="bg-white p-4 rounded shadow space-y-2">
          <button
            onClick={() => setShowLoader(true)}
            className="bg-tigo-blue text-white px-4 py-2 rounded"
          >
            Cargar ubicaciones
          </button>
        </div>
      )}

      {onBack && (
        <button onClick={onBack} className="px-4 py-2 border rounded">
          Volver
        </button>
      )}
    </div>
  );
};

export default DeveloperPanel;
