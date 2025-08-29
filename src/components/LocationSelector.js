import React, { useState, useEffect } from 'react';
import { getRegions, getSubterritories, getPdvs } from '../services/api';

/**
 * Componente encargado de seleccionar la ubicación de un PDV usando datos del API.
 */
const LocationSelector = ({ onSelectPdv }) => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [subterritories, setSubterritories] = useState([]);
  const [selectedSubterritory, setSelectedSubterritory] = useState('');
  const [pdvs, setPdvs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getRegions().then(setRegions).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedRegion) {
      setSubterritories([]);
      setSelectedSubterritory('');
      setPdvs([]);
      return;
    }
    getSubterritories(selectedRegion)
      .then((data) => {
        setSubterritories(data);
        setSelectedSubterritory('');
        setPdvs([]);
      })
      .catch(console.error);
  }, [selectedRegion]);

  useEffect(() => {
    if (!selectedSubterritory) {
      setPdvs([]);
      return;
    }
    getPdvs(selectedSubterritory).then(setPdvs).catch(console.error);
  }, [selectedSubterritory]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Selecciona Ubicación</h2>

      <div className="mb-4">
        <label htmlFor="region-select" className="block text-gray-700 text-sm font-bold mb-2">
          Región:
        </label>
        <select
          id="region-select"
          className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">Selecciona una región</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      {selectedRegion && (
        <div className="mb-4">
          <label htmlFor="subterritory-select" className="block text-gray-700 text-sm font-bold mb-2">
            Subterritorio:
          </label>
          <select
            id="subterritory-select"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
            value={selectedSubterritory}
            onChange={(e) => setSelectedSubterritory(e.target.value)}
          >
            <option value="">Selecciona un subterritorio</option>
            {subterritories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubterritory && (
        <div className="mb-6">
          <label htmlFor="pdv-search" className="block text-gray-700 text-sm font-bold mb-2">
            Buscar PDV:
          </label>
          <input
            type="text"
            id="pdv-search"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 mb-4"
            placeholder="Ingresa nombre o código"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <label htmlFor="pdv-select" className="block text-gray-700 text-sm font-bold mb-2">
            Punto de Venta (PDV):
          </label>
          <select
            id="pdv-select"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
            onChange={(e) => {
              const value = e.target.value;
              if (!value) return;
              const regionName = regions.find((r) => r.id === selectedRegion)?.name || '';
              const subName = subterritories.find((s) => s.id === selectedSubterritory)?.name || '';
              const pdvName = pdvs.find((p) => p.id === value)?.name || '';
              onSelectPdv({
                pdvId: value,
                pdvName,
                regionId: selectedRegion,
                regionName,
                subterritoryId: selectedSubterritory,
                subterritoryName: subName,
              });
            }}
          >
            <option value="">Selecciona un PDV</option>
            {pdvs
              .filter(
                (pdv) =>
                  pdv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  pdv.id.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((pdv) => (
                <option key={pdv.id} value={pdv.id}>
                  {pdv.name}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
