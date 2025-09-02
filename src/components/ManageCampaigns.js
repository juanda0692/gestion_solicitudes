import React, { useState, useEffect } from 'react';
import { campaigns as defaultCampaigns } from '../mock/campaigns';
import { getStorageItem } from '../utils/storage';
import { channels as defaultChannels } from '../mock/channels';
import { materials as defaultMaterials } from '../mock/materials';
import { channelMaterials as defaultChannelMaterials } from '../mock/channelMaterials';

/**
 * Panel para editar o eliminar campañas existentes.
 * Los cambios se guardan en localStorage durante la prueba.
 */
const ManageCampaigns = ({ onBack }) => {
  const [list, setList] = useState([]);

  const [channels, setChannels] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [channelMaterials, setChannelMaterials] = useState({});

  useEffect(() => {
    setChannels(getStorageItem('channels') || defaultChannels);
    setMaterials(getStorageItem('materials') || defaultMaterials);
    setChannelMaterials(getStorageItem('channelMaterials') || defaultChannelMaterials);
  }, []);

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
  }, [channelMaterials, materials]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('campaigns'));
    setList(stored || defaultCampaigns);
  }, []);

  const handleDelete = (id) => {
    const updated = list.filter((c) => c.id !== id);
    setList(updated);
    localStorage.setItem('campaigns', JSON.stringify(updated));
  };

  const updateCampaign = (index, field, value) => {
    const updated = [...list];
    updated[index] = { ...updated[index], [field]: value };
    setList(updated);
    localStorage.setItem('campaigns', JSON.stringify(updated));
  };

  const toggleArrayValue = (array = [], value) =>
    array.includes(value) ? array.filter((v) => v !== value) : [...array, value];

  const getMaterialIds = (list = []) =>
    list.map((m) => (typeof m === 'object' ? m.id : m));

  const toggleMaterialValue = (list = [], value) => {
    const ids = getMaterialIds(list);
    if (ids.includes(value)) {
      return list.filter((m) => (typeof m === 'object' ? m.id : m) !== value);
    }
    return [...list, { id: value, quantity: 1 }];
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Gestionar campañas</h2>
      {list.length === 0 ? (
        <p className="text-center text-gray-600">No hay campañas.</p>
      ) : (
        <div className="space-y-4 mb-4">
          {list.map((c, idx) => (
            <div key={c.id} className="border p-3 rounded">
              <input
                className="w-full mb-2 bg-gray-100 border border-gray-300 py-1 px-2 rounded"
                value={c.name}
                onChange={(e) => updateCampaign(idx, 'name', e.target.value)}
              />
              <div className="mb-2">
                <h3 className="font-semibold text-sm">Prioridad</h3>
                <select
                  className="w-full bg-gray-100 border border-gray-300 py-1 px-2 rounded"
                  value={c.priority}
                  onChange={(e) => updateCampaign(idx, 'priority', e.target.value)}
                >
                  <option value="1">Prioridad 1</option>
                  <option value="2">Prioridad 2</option>
                  <option value="3">Prioridad 3</option>
                </select>
              </div>
              <div className="mb-2">
                <h3 className="font-semibold text-sm">Canales</h3>
                {channels.map((ch) => (
                  <label key={ch.id} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={(c.channels || []).includes(ch.id)}
                      onChange={() =>
                        updateCampaign(
                          idx,
                          'channels',
                          toggleArrayValue(c.channels, ch.id),
                        )
                      }
                    />
                    {ch.name}
                  </label>
                ))}
              </div>
              <div className="mb-2">
                <h3 className="font-semibold text-sm">Materiales</h3>
                {materials.map((m) => (
                  <label key={m.id} className="block">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={getMaterialIds(c.materials || []).includes(m.id)}
                      onChange={() =>
                        updateCampaign(
                          idx,
                          'materials',
                          toggleMaterialValue(c.materials, m.id),
                        )
                      }
                    />
                    {m.name}{' '}
                    {m.requiresCotizacion && (
                      <span className="text-xs text-gray-500">
                        (Cotizable – sin stock predeterminado)
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      (
                      {(channelsByMaterial[m.id] || [])
                        .map((cid) => channels.find((ch) => ch.id === cid)?.name || cid)
                        .join(', ')}
                      )
                    </span>
                  </label>
                ))}
              </div>
              <button onClick={() => handleDelete(c.id)} className="text-red-500 mt-2">Eliminar</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={onBack} className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all">
        Volver
      </button>
    </div>
  );
};

export default ManageCampaigns;
