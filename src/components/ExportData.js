import React, { useState } from 'react';
import { channels } from '../mock/channels';
import { pdvs } from '../mock/locations';
import { materials } from '../mock/materials';

const flattenPdvs = Object.values(pdvs).flat();

const toggleValue = (arr, value) =>
  arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

const ExportData = ({ onBack, onExport }) => {
  const [customMode, setCustomMode] = useState(false);
  const [selectedPdvs, setSelectedPdvs] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  const handleExportChannel = (channelId) => {
    onExport({ channelId });
  };

  const handleCustomExport = () => {
    onExport({
      channelId: 'personalizado',
      pdvIds: selectedPdvs,
      materialIds: selectedMaterials,
    });
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
                {m.name}
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
