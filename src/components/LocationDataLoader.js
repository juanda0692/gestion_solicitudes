import React, { useState } from 'react';
import {
  parseExcel,
  validateRawData,
  buildNormalized,
  toNormalizedJS,
} from '../utils/locationImport';
import {
  setImportedLocations,
  clearImportedLocations,
  getActiveLocations,
  countSubs,
  countPdvs,
  hasImportedData,
} from '../utils/locationsSource';
import { setStorageItem } from '../utils/storage';
import { useToast } from './ui/ToastProvider';

/**
 * Carga datos de ubicaciones desde un archivo Excel y permite aplicarlos a la
 * aplicación o exportarlos como JSON/JS.
 */
const LocationDataLoader = ({ onBack }) => {
  const [raw, setRaw] = useState(null);
  const [errors, setErrors] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [normalized, setNormalized] = useState(null);
  const [active, setActive] = useState(getActiveLocations());
  const addToast = useToast();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const parsed = await parseExcel(file);
    setRaw(parsed);
    const v = validateRawData(
      parsed.rawRegions,
      parsed.rawSubterritories,
      parsed.rawPdvs,
    );
    const allErrors = [...(parsed.issues || []), ...v.errors];
    setErrors(allErrors);
    if (allErrors.length === 0) {
      const norm = buildNormalized(parsed);
      const pdvCount = countPdvs(norm.pdvs);
      setWarnings([...(v.warnings || []), ...(norm.warnings || [])]);
      setConflicts(norm.warnings || []);
      if (pdvCount > 0) {
        setNormalized(norm);
        if (process.env.NODE_ENV === 'development') {
          const subKeys = Object.keys(norm.subterritories).slice(0, 3);
          const pdvKeys = Object.keys(norm.pdvs).slice(0, 3);
          // eslint-disable-next-line no-console
          console.log(
            `Imported preview → regiones:${norm.regions.length}, subterritorios:${countSubs(
              norm.subterritories,
            )}, pdvs:${pdvCount}`,
          );
          // eslint-disable-next-line no-console
          console.log('subterritories keys', subKeys);
          // eslint-disable-next-line no-console
          console.log('pdvs keys', pdvKeys);
        }
      } else {
        setErrors(['El archivo no contiene PDVs válidos']);
        setNormalized(null);
      }
    } else {
      setWarnings(v.warnings);
      setNormalized(null);
    }
  };

  const handleApply = () => {
    if (!normalized || errors.length > 0) return;
    setImportedLocations(normalized);
    setStorageItem('normalization_report', {
      idMap: {},
      duplicatesRemoved: [],
      warnings,
      conflicts,
    });
    setActive(getActiveLocations());
    if (hasImportedData(normalized)) {
      addToast('Datos importados. Actívalos desde el panel de desarrollador.');
    } else {
      addToast('El archivo importado no contiene registros válidos. Se mantiene el dataset base.');
    }
  };

  const handleUseBundled = () => {
    clearImportedLocations();
    setActive(getActiveLocations());
    addToast('Se restauraron las ubicaciones por defecto');
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
      <p className="text-sm">
        {active.source === 'imported'
          ? `Fuente activa: Imported (Regiones: ${active.regions.length}, Subterritorios: ${countSubs(
              active.subterritories,
            )}, PDVs: ${countPdvs(active.pdvs)}) — ${new Date(
              active.importedAt,
            ).toLocaleString()}`
          : 'Fuente activa: Bundled (usando datos del código)'}
      </p>
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
      <div className="space-x-2">
        <button onClick={handleUseBundled} className="px-3 py-1 border rounded">
          Usar dataset base
        </button>
        {onBack && (
          <button onClick={onBack} className="px-3 py-1 border rounded">
            Volver
          </button>
        )}
      </div>
    </div>
  );
};

export default LocationDataLoader;
