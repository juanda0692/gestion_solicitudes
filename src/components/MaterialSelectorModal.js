import React from 'react';

/**
 * Modal para seleccionar materiales de forma cómoda.
 */
const MaterialSelectorModal = ({
  materials = [],
  selectedMaterials = [],
  onToggle,
  search,
  setSearch,
  onClose,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">Seleccionar materiales</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>
      <input
        type="text"
        placeholder="Buscar material"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-2 bg-gray-100 border border-gray-300 py-1 px-2 rounded"
      />
      <div className="max-h-60 overflow-y-auto border border-gray-200 p-2 rounded">
        {materials
          .filter((m) => m.name.toLowerCase().includes(search.toLowerCase()))
          .map((m) => (
            <label key={m.id} className="block cursor-pointer">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedMaterials.includes(m.id)}
                onChange={() => onToggle(m.id)}
              />
              {m.name}
            </label>
          ))}
      </div>
      <button
        onClick={onClose}
        className="w-full mt-4 bg-tigo-blue text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all"
      >
        Aceptar
      </button>
    </div>
  </div>
);

export default MaterialSelectorModal;
