import React, { useState } from 'react';
import { parseExcel, validateRawData, buildNormalized, applyNormalized, toNormalizedJS } from '../utils/locationImport';

/**
 * Carga datos de ubicaciones desde un archivo Excel y permite aplicarlos a la
 * aplicación o exportarlos como JSON/JS.
 */
const LocationDataLoader = ({ onBack }) => {
  const [raw, setRaw] = useState(null);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [normalized, setNormalized] = useState(null);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const parsed = await parseExcel(file);
    setRaw(parsed);
    const v = validateRawData(parsed.rawRegions, parsed.rawSubterritories, parsed.rawPdvs);
    setErrors(v.errors);
    setWarnings(v.warnings);
    if (v.errors.length === 0) {
      setNormalized(buildNormalized(parsed));
    } else {
      setNormalized(null);
    }
  };

  const handleApply = () => {
    if (!raw || errors.length > 0) return;
    applyNormalized(raw);
    alert('Datos aplicados. Recarga la página para ver los cambios.');
    onBack && onBack();
  };

  const download = (content, filename, type) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    if (!normalized) return;
    download(JSON.stringify(normalized, null, 2), 'locations.json', 'application/json');
  };

  const handleDownloadJs = () => {
    if (!normalized) return;
    download(toNormalizedJS(normalized), 'locations.js', 'application/javascript');
  };

  return (
    <div className="max-w-2xl w-full bg-white p-4 rounded shadow space-y-4">
      <h2 className="text-xl font-semibold">Cargar ubicaciones</h2>
      <input type="file" accept=".xlsx" onChange={handleFile} />
      {errors.length > 0 && (
        <div className="text-red-600 text-sm">
          <p>Errores encontrados:</p>
          <ul className="list-disc pl-4">
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div className="text-yellow-600 text-sm">
          <p>Advertencias:</p>
          <ul className="list-disc pl-4">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}
      {normalized && (
        <div className="space-y-2">
          <p>
            Regiones: {normalized.regions.length} - Subterritorios:{' '}
            {Object.values(normalized.subterritories).flat().length} - PDVs:{' '}
            {Object.values(normalized.pdvs).flat().length}
          </p>
          <div className="space-x-2">
            <button onClick={handleApply} className="bg-tigo-blue text-white px-3 py-1 rounded">
              Aplicar en la app
            </button>
            <button onClick={handleDownloadJson} className="px-3 py-1 border rounded">
              Descargar JSON
            </button>
            <button onClick={handleDownloadJs} className="px-3 py-1 border rounded">
              Descargar locations.js
            </button>
          </div>
        </div>
      )}
      {onBack && (
        <button onClick={onBack} className="px-3 py-1 border rounded">
          Volver
        </button>
      )}
    </div>
  );
};

export default LocationDataLoader;
