import React, { useEffect, useState } from 'react';
import {
  fetchRegions,
  fetchChannels,
  fetchPdvsByRegionAndChannel,
} from '../services/tradeNational';
import StateBlock from './ui/StateBlock';

/**
 * Pantalla de exportación de PDVs para Trade Nacional.
 *
 * Permite seleccionar región y canal para listar PDVs, escogerlos
 * mediante checkboxes y exportar los datos o abrir una selección
 * personalizada.
 */
const ExportData = ({ onBack, onExport }) => {
  const [regions, setRegions] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('');
  const [pdvs, setPdvs] = useState([]);
  const [filteredPdvs, setFilteredPdvs] = useState([]);
  const [selectedPdvs, setSelectedPdvs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // Cargar catálogos
  useEffect(() => {
    fetchRegions().then(setRegions).catch(() => setError(true));
    fetchChannels().then(setChannels).catch(() => setError(true));
  }, []);

  // Obtener PDVs al cambiar filtros
  useEffect(() => {
    if (!selectedRegion) {
      setPdvs([]);
      setSelectedPdvs([]);
      return;
    }
    setLoading(true);
    fetchPdvsByRegionAndChannel(selectedRegion, selectedChannel)
      .then((list) => {
        setPdvs(list);
        setSelectedPdvs([]);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [selectedRegion, selectedChannel]);

  // Filtrado por texto
  useEffect(() => {
    const term = search.toLowerCase();
    setFilteredPdvs(
      pdvs.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.id.toLowerCase().includes(term),
      ),
    );
  }, [search, pdvs]);

  const togglePdv = (id) => {
    setSelectedPdvs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => setSelectedPdvs(pdvs.map((p) => p.id));
  const handleClearSelection = () => setSelectedPdvs([]);

  const handleExport = () => {
    const regionName = regions.find((r) => r.id === selectedRegion)?.name || '';
    const channelName =
      channels.find((c) => c.id === selectedChannel)?.name || '';
    const list = pdvs.filter((p) => selectedPdvs.includes(p.id));
    const exportObj = {
      regionName,
      channelName,
      pdvs: list,
      meta: { type: 'pdv-list' },
    };
    onExport(exportObj, { excel: true });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        PDVs por Región y Canal
      </h2>
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Región:
          </label>
          <select
            value={selectedRegion}
            onChange={(e) => {
              setSelectedRegion(e.target.value);
              setSelectedChannel('');
              setSearch('');
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
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Canal:
          </label>
          <select
            value={selectedChannel}
            onChange={(e) => {
              setSelectedChannel(e.target.value);
            }}
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg"
          >
            <option value="">Todos</option>
            {channels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        {selectedRegion && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Buscar PDV:
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ingresa nombre o código"
              className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg mb-2"
            />
            <div className="border border-gray-200 rounded max-h-60 overflow-y-auto">
              {loading && <StateBlock variant="loading" title="Cargando..." />}
              {!loading && filteredPdvs.length === 0 && (
                <StateBlock variant="empty" title="No hay PDVs" />
              )}
              {!loading &&
                filteredPdvs.map((p) => (
                  <label
                    key={p.id}
                    className="flex items-center space-x-2 px-2 py-1 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPdvs.includes(p.id)}
                      onChange={() => togglePdv(p.id)}
                    />
                    <span>{p.name}</span>
                  </label>
                ))}
            </div>
            {pdvs.length > 0 && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  {`${selectedPdvs.length} PDVs seleccionados de ${pdvs.length}`}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-tigo-blue"
                  >
                    Seleccionar todo
                  </button>
                  <button
                    onClick={handleClearSelection}
                    className="text-sm text-tigo-blue"
                  >
                    Limpiar selección
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2">
        <button
          onClick={handleExport}
          disabled={selectedPdvs.length === 0}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          Exportar datos
        </button>
        <button
          onClick={() => setShowCustom(true)}
          disabled={selectedPdvs.length === 0}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all disabled:opacity-50"
        >
          Personalizado
        </button>
        <button
          onClick={onBack}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all"
        >
          Volver al Inicio
        </button>
      </div>
      {showCustom && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Selección personalizada
            </h3>
            <div className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded">
              {pdvs.map((p) => (
                <label
                  key={p.id}
                  className="flex items-center space-x-2 px-2 py-1 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={selectedPdvs.includes(p.id)}
                    onChange={() => togglePdv(p.id)}
                  />
                  <span>{p.name}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCustom(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowCustom(false)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportData;

