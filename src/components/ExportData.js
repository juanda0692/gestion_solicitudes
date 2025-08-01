import React, { useState } from 'react';
import { channels } from '../mock/channels';
import { regions, subterritories, pdvs } from '../mock/locations';
import { getStorageItem } from '../utils/storage';

const getPdvInfo = (pdvId) => {
  let subId = '';
  let pdvName = pdvId;
  Object.entries(pdvs).forEach(([sId, list]) => {
    const found = list.find((p) => p.id === pdvId);
    if (found) {
      subId = sId;
      pdvName = found.name;
    }
  });
  let regionId = '';
  Object.entries(subterritories).forEach(([rId, subs]) => {
    if (subs.find((s) => s.id === subId)) {
      regionId = rId;
    }
  });
  const regionName = regions.find((r) => r.id === regionId)?.name || regionId;
  const subName =
    (subterritories[regionId] || []).find((s) => s.id === subId)?.name || subId;
  return {
    id: pdvId,
    name: pdvName,
    subterritoryId: subId,
    subterritoryName: subName,
    regionId,
    regionName,
  };
};


const ExportData = ({ onBack, onExport }) => {
  const [customMode, setCustomMode] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedSubterritory, setSelectedSubterritory] = useState('');
  const [selectedPdv, setSelectedPdv] = useState('');
  const [summary, setSummary] = useState(null);


  const buildExportObject = (requests, type, channelId) => {
    const channelName =
      channels.find((c) => c.id === channelId)?.name || channelId;
    return {
      type,
      channelId,
      channelName,
      requestDate: new Date().toISOString(),
      pdvs: requests.map((req) => ({
        ...getPdvInfo(req.pdvId),
        zone: req.zones || [],
        priority: req.priority || '',
        campaigns: req.campaigns || [],
        pdvData: req.pdvData || getStorageItem(`pdv-${req.pdvId}-data`) || {},
        materials: req.items.map((it) => ({
          id: it.material.id,
          name: it.material.name,
          quantity: it.quantity,
          measure: it.measures.name,
          requiresCotizacion: it.material.requiresCotizacion,
          observations: it.notes || '',
        })),
      })),
    };
  };

  const handleExportChannel = (channelId) => {
    const allRequests = getStorageItem('material-requests') || [];
    const channelRequests = allRequests.filter((r) => r.channelId === channelId);
    const exportObj = buildExportObject(channelRequests, 'canal', channelId);
    onExport(exportObj);
  };

  const collectPdvIds = () => {
    if (!selectedRegion) return [];
    if (selectedPdv) return [selectedPdv];
    if (selectedSubterritory) {
      return (pdvs[selectedSubterritory] || []).map((p) => p.id);
    }
    let ids = [];
    (subterritories[selectedRegion] || []).forEach((sub) => {
      ids = ids.concat((pdvs[sub.id] || []).map((p) => p.id));
    });
    return ids;
  };

  const buildFilteredRequests = () => {
    const allRequests = getStorageItem('material-requests') || [];
    const pdvIds = collectPdvIds();
    return allRequests.filter((r) => pdvIds.includes(r.pdvId));
  };

  const handleGenerateSummary = () => {
    const filtered = buildFilteredRequests();
    const exportObj = buildExportObject(filtered, 'personalizado', 'personalizado');
    setSummary(exportObj);
  };

  const handleCustomExport = () => {
    const filtered = buildFilteredRequests();
    const exportObj = buildExportObject(filtered, 'personalizado', 'personalizado');
    onExport(exportObj);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Exporte de datos para los siguientes canales
      </h2>
      {!customMode ? (
        <>
          <div className="space-y-2 mb-4">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleExportChannel(ch.id)}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all"
              >
                {ch.name}
              </button>
            ))}
            <button
              onClick={() => setCustomMode(true)}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all"
            >
              PERSONALIZADO
            </button>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all"
          >
            Volver
          </button>
        </>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Región:</label>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setSelectedSubterritory('');
                  setSelectedPdv('');
                  setSummary(null);
                }}
                className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg"
              >
                <option value="">Selecciona una región</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            {selectedRegion && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Subterritorio:</label>
                <select
                  value={selectedSubterritory}
                  onChange={(e) => {
                    setSelectedSubterritory(e.target.value);
                    setSelectedPdv('');
                    setSummary(null);
                  }}
                  className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg"
                >
                  <option value="">Todos</option>
                  {(subterritories[selectedRegion] || []).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {selectedSubterritory && (
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">PDV:</label>
                <select
                  value={selectedPdv}
                  onChange={(e) => {
                    setSelectedPdv(e.target.value);
                    setSummary(null);
                  }}
                  className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg"
                >
                  <option value="">Todos</option>
                  {(pdvs[selectedSubterritory] || []).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="mb-4">
            <button
              onClick={handleGenerateSummary}
              disabled={!selectedRegion}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all disabled:opacity-50"
            >
              Mostrar resumen
            </button>
          </div>
          {summary && (
            <div className="border p-3 rounded mb-4 bg-gray-50">
              <h4 className="font-semibold mb-2">PDVs a exportar:</h4>
              {summary.pdvs.length === 0 ? (
                <p className="text-sm text-gray-600">No hay datos para exportar</p>
              ) : (
                <ul className="list-disc list-inside text-sm space-y-1">
                  {summary.pdvs.map((p) => (
                    <li key={p.id}>{p.name}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <button
            onClick={handleCustomExport}
            disabled={!selectedRegion}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all mb-4 disabled:opacity-50"
          >
            Exportar Datos
          </button>
          <button
            onClick={() => {
              setCustomMode(false);
              setSelectedRegion('');
              setSelectedSubterritory('');
              setSelectedPdv('');
              setSummary(null);
            }}
            className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all"
          >
            Cancelar
          </button>
        </>
      )}
    </div>
  );
};

export default ExportData;
