import React, { useState, useRef, useEffect } from 'react';
import { channels } from '../mock/channels';
import { regions, subterritories, pdvs } from '../mock/locations';
import { getStorageItem } from '../utils/storage';
import StateBlock from './ui/StateBlock';

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
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const summaryRef = useRef(null);
  const noDataRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (showSummaryModal && summaryRef.current) {
      lastFocused.current = document.activeElement;
      summaryRef.current.focus();
    }
  }, [showSummaryModal]);

  useEffect(() => {
    if (showNoDataModal && noDataRef.current) {
      lastFocused.current = document.activeElement;
      noDataRef.current.focus();
    }
  }, [showNoDataModal]);


  const buildExportObject = (requests, scope) => {
    return {
      scope,
      pdvs: requests.map((req) => {
        const info = getPdvInfo(req.pdvId);
        return {
          ...info,
          regionName: req.region || info.regionName,
          subterritoryName: req.subterritory || info.subterritoryName,
          channelId: req.channelId,
          channelName:
            channels.find((c) => c.id === req.channelId)?.name || req.channelId,
          date: req.date || new Date().toISOString(),
          requestType: 'Solicitud',
          zone: req.zones || [],
          priority: req.priority || '',
          campaigns: req.campaigns || [],
          pdvData:
            req.pdvSnapshot ||
            req.pdvData ||
            getStorageItem(`pdv-${req.pdvId}-data`) || {},
          materials: (req.items || []).map((it) => ({
            id: it.material.id,
            name: it.material.name,
            quantity: it.quantity,
            measure: it.measures.name,
            requiresCotizacion: it.material.requiresCotizacion,
            observations: it.notes || '',
          })),
        };
      }),
    };
  };

  const handleExportChannel = (channelId) => {
    const allRequests = getStorageItem('material-requests') || [];
    const channelRequests = allRequests.filter((r) => r.channelId === channelId);
    const channelName =
      channels.find((c) => c.id === channelId)?.name || channelId;
    if (channelRequests.length === 0) {
      setShowNoDataModal(true);
      return;
    }
    const exportObj = buildExportObject(channelRequests, `Canal-${channelName}`);
    onExport(exportObj);
  };

  const collectPdvIds = () => {
    if (!selectedRegion) return [];
    if (selectedPdv) return [selectedPdv];
    if (selectedSubterritory) {
      return (pdvs[selectedSubterritory] || [])
        .filter((p) => p.complete)
        .map((p) => p.id);
    }
    let ids = [];
    (subterritories[selectedRegion] || []).forEach((sub) => {
      ids = ids.concat(
        (pdvs[sub.id] || [])
          .filter((p) => p.complete)
          .map((p) => p.id),
      );
    });
    return ids;
  };

  const buildFilteredRequests = () => {
    const allRequests = getStorageItem('material-requests') || [];
    const pdvIds = collectPdvIds();
    return allRequests.filter((r) => pdvIds.includes(r.pdvId));
  };

  const getScopeLabel = () => {
    if (selectedPdv) {
      const pdvName =
        (pdvs[selectedSubterritory] || []).find((p) => p.id === selectedPdv)?.name ||
        selectedPdv;
      return `PDV-${pdvName}`;
    }
    if (selectedSubterritory) {
      const subName =
        (subterritories[selectedRegion] || []).find((s) => s.id === selectedSubterritory)?.name ||
        selectedSubterritory;
      return `Subterritorio-${subName}`;
    }
    const regionName = regions.find((r) => r.id === selectedRegion)?.name || selectedRegion;
    return `Region-${regionName}`;
  };

  const handleGenerateSummary = () => {
    const filtered = buildFilteredRequests();
    if (filtered.length === 0) {
      setShowNoDataModal(true);
      return;
    }
    const exportObj = buildExportObject(filtered, getScopeLabel());
    const totalItems = filtered.reduce((sum, r) => sum + (r.items ? r.items.length : 0), 0);
    setSummary({ ...exportObj, totalItems });
    setShowSummaryModal(true);
  };

  const handleConfirmExport = () => {
    if (summary) {
      onExport(summary);
    }
    setShowSummaryModal(false);
    setSummary(null);
    lastFocused.current && lastFocused.current.focus();
  };

  const closeSummary = () => {
    setShowSummaryModal(false);
    setSummary(null);
    lastFocused.current && lastFocused.current.focus();
  };

  const closeNoData = () => {
    setShowNoDataModal(false);
    lastFocused.current && lastFocused.current.focus();
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
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-tigo-blue"
              >
                {ch.name}
              </button>
            ))}
            <button
              onClick={() => setCustomMode(true)}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-tigo-blue"
            >
              PERSONALIZADO
            </button>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all focus:outline-none focus:ring-2 focus:ring-tigo-blue"
          >
            Volver al Inicio
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
                  {(pdvs[selectedSubterritory] || [])
                    .filter((p) => p.complete)
                    .map((p) => (
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
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-tigo-blue"
            >
              Mostrar resumen
            </button>
          </div>
          {/* El resumen y exportación se manejan mediante un modal */}
          <button
            onClick={() => {
              setCustomMode(false);
              setSelectedRegion('');
              setSelectedSubterritory('');
              setSelectedPdv('');
              setSummary(null);
            }}
            className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all focus:outline-none focus:ring-2 focus:ring-tigo-blue"
          >
            Volver al Inicio
          </button>
        </>
      )}
      {showSummaryModal && summary && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="summary-title"
          onKeyDown={(e) => e.key === 'Escape' && closeSummary()}
        >
          <div
            ref={summaryRef}
            tabIndex="-1"
            className="bg-white p-6 rounded-xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
          >
            <h3 id="summary-title" className="text-lg font-semibold mb-2">Resumen de exportación</h3>
            <div className="text-sm mb-4 space-y-1">
              <p>Región: {regions.find((r) => r.id === selectedRegion)?.name}</p>
              {selectedSubterritory && (
                <p>
                  Subterritorio:{' '}
                  {(subterritories[selectedRegion] || []).find((s) => s.id === selectedSubterritory)?.name}
                </p>
              )}
              {selectedPdv && (
                <p>
                  PDV:{' '}
                  {(pdvs[selectedSubterritory] || []).find((p) => p.id === selectedPdv)?.name}
                </p>
              )}
              <p>PDVs: {summary.pdvs.length}</p>
              <p>Ítems: {summary.totalItems}</p>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeSummary}
                className="px-4 py-2 bg-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-tigo-blue"
              >
                Revisar otra vez
              </button>
              <button
                onClick={handleConfirmExport}
                className="px-4 py-2 bg-green-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-tigo-blue"
              >
                Exportar
              </button>
            </div>
          </div>
        </div>
      )}
      {showNoDataModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => e.key === 'Escape' && closeNoData()}
        >
          <div
            ref={noDataRef}
            tabIndex="-1"
            className="bg-white p-6 rounded-xl max-w-sm w-full max-h-[80vh] overflow-y-auto"
          >
            <StateBlock
              variant="empty"
              title="No hay datos para exportar. Revisa tu selección y filtros."
              actionLabel="Revisar otra vez"
              onAction={closeNoData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData;
