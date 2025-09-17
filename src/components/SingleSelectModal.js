import React from 'react';
import { getDisplayName } from '../utils/materialDisplay';

const SingleSelectModal = ({
  title = '',
  items = [],
  selectedId,
  onSelect,
  search,
  setSearch,
  onClose,
  placeholder = 'Buscar',
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
    <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-2 bg-gray-100 border border-gray-300 py-1 px-2 rounded"
      />
      <div className="max-h-60 overflow-y-auto border border-gray-200 p-2 rounded space-y-2">
        {items
          .filter((it) => it.name.toLowerCase().includes(search.toLowerCase()))
          .map((it) => (
            <label key={it.material_id} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="material"
                className="mr-2"
                checked={selectedId === it.material_id}
                onChange={() => {
                  onSelect(it.material_id);
                }}
              />
              {getDisplayName(it.name)}
            </label>
          ))}
        {items.filter((it) => it.name.toLowerCase().includes(search.toLowerCase())).length === 0 && (
          <p className="text-sm text-gray-600">Sin resultados</p>
        )}
      </div>
      <button
        onClick={onClose}
        className="w-full mt-4 bg-tigo-blue text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all"
      >
        Cerrar
      </button>
    </div>
  </div>
);

export default SingleSelectModal;