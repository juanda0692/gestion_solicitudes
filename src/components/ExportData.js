import React, { useState } from 'react';
import { channels } from '../mock/channels';
import { regions, subterritories, pdvs } from '../mock/locations';
import { materials } from '../mock/materials';
import { channelMaterials } from '../mock/channelMaterials';
import { getStorageItem } from '../utils/storage';

const flattenPdvs = Object.values(pdvs).flat();

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

const toggleValue = (arr, value) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const ExportData = ({ onBack, onExport }) => {
  const [customMode, setCustomMode] = useState(false);
  const [selectedPdvs, setSelectedPdvs] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const channelsByMaterial = React.useMemo(() => {
    const result = {};
    Object.entries(channelMaterials).forEach(([ch, mats]) => {
      mats.forEach(({ id }) => {
        if (!result[id]) result[id] = [];
        result[id].push(ch);
      });
    });
    materials.forEach((m) => {
      if (m.requiresCotizacion && m.canalesPermitidos) {
        if (!result[m.id]) result[m.id] = [];
        m.canalesPermitidos.forEach((ch) => {
          if (!result[m.id].includes(ch)) result[m.id].push(ch);
        });
      }
    });
    return result;
  }, []);

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

  const handleCustomExport = () => {
    const allRequests = getStorageItem('material-requests') || [];
    let filtered = allRequests;
    if (selectedPdvs.length > 0) {
      filtered = filtered.filter((r) => selectedPdvs.includes(r.pdvId));
    }
    if (selectedMaterials.length > 0) {
      filtered = filtered
        .map((r) => ({
          ...r,
          items: r.items.filter((i) => selectedMaterials.includes(i.material.id)),
        }))
        .filter((r) => r.items.length > 0);
    }
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecciona PDV</h3>
          <div className="max-h-40 overflow-y-auto border p-2 mb-4">
            {flattenPdvs.map((p) => (
              <label key={p.id} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedPdvs.includes(p.id)}
                  onChange={() => setSelectedPdvs(toggleValue(selectedPdvs, p.id))}
                />
                {p.name}
              </label>
            ))}
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Selecciona Materiales</h3>
          <div className="max-h-40 overflow-y-auto border p-2 mb-4">
            {materials.map((m) => (
              <label key={m.id} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedMaterials.includes(m.id)}
                  onChange={() =>
                    setSelectedMaterials(toggleValue(selectedMaterials, m.id))
                  }
                />
                {m.name}{' '}
                {m.requiresCotizacion && (
                  <span className="text-xs text-gray-500">
                    (Cotizable – sin stock predeterminado)
                  </span>
                )}{' '}
                <span className="text-xs text-gray-500">
                  (
                  {(channelsByMaterial[m.id] || [])
                    .map((cid) => channels.find((c) => c.id === cid)?.name || cid)
                    .join(', ')}
                  )
                </span>
              </label>
            ))}
          </div>
          <button
            onClick={handleCustomExport}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all mb-4"
          >
            Exportar Selección
          </button>
          <button
            onClick={() => setCustomMode(false)}
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
