import React, { useState, useEffect } from 'react';
import {
  getStorageItem,
  setStorageItem,
} from '../utils/storage';

/**
 * Formulario para actualizar los datos de un Punto de Venta.
 *
 * Los datos se guardan de manera local utilizando localStorage.
 * Al conectar con un servicio real, estas funciones deben invocar
 * las API correspondientes.
 */

const PdvUpdateForm = ({ selectedPdvId, onUpdateConfirm }) => {
  /* ----------------------------- Estados ----------------------------- */
  // Información editable del PDV
  const [pdvData, setPdvData] = useState({
    contactName: '',
    contactPhone: '',
    city: '',
    address: '',
    notes: '',
    additionalFields: [],
  });
  // Campo que se está editando actualmente
  const [editingField, setEditingField] = useState(null);
  // Estado para controlar la ventana de confirmación
  const [showConfirm, setShowConfirm] = useState(false);
  const [defaultAction, setDefaultAction] = useState('none'); // new | replace | none
  const [showNewDataModal, setShowNewDataModal] = useState(false); // aviso cuando se crea desde cero
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  // Conjunto de datos predeterminados almacenados para el PDV
  const [pdvDefaultsList, setPdvDefaultsList] = useState([]);
  // Permite indicar si los cambios actuales se deben guardar como predeterminados
  const [saveAsDefault, setSaveAsDefault] = useState(false);
  // Índice del set de predeterminados que coincide exactamente con los datos actuales
  const [matchedDefaultIndex, setMatchedDefaultIndex] = useState(-1);
  // Búsqueda en la lista de predeterminados
  const [searchQuery, setSearchQuery] = useState('');

  /* ---------------------------- Efectos ------------------------------ */
  // Carga datos guardados del PDV y sus valores predeterminados
  useEffect(() => {
    const storedPdvData = getStorageItem(`pdv-${selectedPdvId}-data`);
    if (storedPdvData) {
      setPdvData({
        contactName: storedPdvData.contactName || '',
        contactPhone: storedPdvData.contactPhone || '',
        city: storedPdvData.city || '',
        address: storedPdvData.address || '',
        notes: storedPdvData.notes || '',
        additionalFields: storedPdvData.additionalFields || [],
      });
    } else {
      // Reiniciar si no existen datos previos
      setPdvData({
        contactName: '',
        contactPhone: '',
        city: '',
        address: '',
        notes: '',
        additionalFields: [],
      });
    }

    const storedDefaultsList =
      getStorageItem(`pdv-${selectedPdvId}-defaults-list`) || [];
    setPdvDefaultsList(Array.isArray(storedDefaultsList) ? storedDefaultsList : []);
    setIsCreatingNew(false);
  }, [selectedPdvId]);

  /* --------------------------- Handlers ------------------------------ */
  // Actualiza un campo del formulario principal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPdvData((prev) => ({ ...prev, [name]: value }));
  };

  // Actualiza un campo adicional creado por el usuario
  const handleAdditionalFieldChange = (index, key, value) => {
    setPdvData((prev) => {
      const updated = [...prev.additionalFields];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, additionalFields: updated };
    });
  };

  // Cuando cambian los datos del formulario o la lista de predeterminados,
  // verificamos si existe una coincidencia exacta para deshabilitar el guardado
  useEffect(() => {
    const idx = pdvDefaultsList.findIndex((def) => isEqualToDefault(pdvData, def));
    setMatchedDefaultIndex(idx);
    if (idx !== -1) {
      setSaveAsDefault(false);
    }
  }, [pdvData, pdvDefaultsList]);


  // Determina si existe un set de predeterminados muy similar
  const findSimilarDefaultsIndex = (data, list) =>
    list.findIndex((def) => {
      let match = 0;
      if ((def.contactName || '') === (data.contactName || '')) match++;
      if ((def.contactPhone || '') === (data.contactPhone || '')) match++;
      if ((def.city || '') === (data.city || '')) match++;
      if ((def.address || '') === (data.address || '')) match++;
      return match >= 3;
    });

  // Verifica si los datos actuales son idénticos a un set de predeterminados
  const isEqualToDefault = (data, def) => {
    if (!def) return false;
    const fields = ['contactName', 'contactPhone', 'city', 'address', 'notes'];
    for (const f of fields) {
      if ((data[f] || '') !== (def[f] || '')) return false;
    }
    if ((data.additionalFields || []).length !== (def.additionalFields || []).length)
      return false;
    return (data.additionalFields || []).every((f, i) => {
      const d = def.additionalFields[i] || {};
      return (f.label || '') === (d.label || '') && (f.value || '') === (d.value || '');
    });
  };

  // Guarda un conjunto de datos predeterminados para el PDV
  const savePdvDefaults = (data) => {
    const list = getStorageItem(`pdv-${selectedPdvId}-defaults-list`) || [];
    const entry = {
      ...data,
      savedAt: new Date().toISOString(),
      autoLabel: `PDV: ${data.city} – ${data.contactName}`,
    };
    const idx = findSimilarDefaultsIndex(data, list);
    let newList;
    if (idx !== -1) {
      console.log('Reemplazando set predeterminado existente en índice', idx);
      newList = [...list];
      newList[idx] = entry;
    } else {
      console.log('Guardando nuevo set de datos predeterminados');
      newList = [...list, entry];
    }
    setPdvDefaultsList(newList);
    setStorageItem(`pdv-${selectedPdvId}-defaults-list`, newList);
  };

  // Finaliza la edición de un campo
  const handleSaveField = () => {
    setEditingField(null);
  };

  // Finaliza la edición de un campo adicional
  const handleSaveAdditionalField = () => {
    setEditingField(null);
  };

  // Aplica un conjunto de valores predeterminados al formulario
  const handleApplyDefaults = (defaults) => {
    if (defaults) {
      const { savedAt, ...data } = defaults;
      setPdvData(data);
      setIsCreatingNew(false);
    }
  };

  // Limpia el formulario para comenzar un nuevo set de datos
  const handleAddNewData = () => {
    setPdvData({
      contactName: '',
      contactPhone: '',
      city: '',
      address: '',
      notes: '',
      additionalFields: [],
    });
    setMatchedDefaultIndex(-1);
    setSaveAsDefault(false);
    setIsCreatingNew(true);
  };

  // Elimina un conjunto de valores predeterminados guardados
  const handleDeleteDefaults = (index) => {
    const updated = [...pdvDefaultsList];
    updated.splice(index, 1);
    setPdvDefaultsList(updated);
    setStorageItem(`pdv-${selectedPdvId}-defaults-list`, updated);
  };

  // Abre el modal de confirmación
  const handleSubmit = () => {
    if (
      !pdvData.contactName.trim() ||
      !pdvData.contactPhone.trim() ||
      !pdvData.city.trim() ||
      !pdvData.address.trim()
    ) {
      alert('Por favor complete los campos requeridos');
      return;
    }

    if (isCreatingNew && !saveAsDefault) {
      setShowNewDataModal(true);
      return;
    }

    if (saveAsDefault) {
      const list = getStorageItem(`pdv-${selectedPdvId}-defaults-list`) || [];
      const idx = findSimilarDefaultsIndex(pdvData, list);
      setDefaultAction(idx !== -1 ? 'replace' : 'new');
    } else {
      setDefaultAction('none');
    }

    setShowConfirm(true);
  };

  // Ejecuta el guardado definitivo
  const finalizeSubmit = () => {
    setStorageItem(`pdv-${selectedPdvId}-data`, pdvData);
    if (saveAsDefault && matchedDefaultIndex === -1) {
      savePdvDefaults(pdvData);
      setSaveAsDefault(false);
    }

    const updates = getStorageItem('pdv-update-requests') || [];
    const updateEntry = {
      pdvId: selectedPdvId,
      data: pdvData,
      date: new Date().toISOString(),
    };
    setStorageItem('pdv-update-requests', [...updates, updateEntry]);

    setShowConfirm(false);
    setIsCreatingNew(false);
    onUpdateConfirm(pdvData);
  };

  /* ---------------------------- Render ------------------------------- */
  // Devuelve un bloque editable con su respectiva etiqueta
  const renderField = (label, fieldName, multiline = false) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        {label}:
      </label>
      {editingField === fieldName ? (
        <>
          {multiline ? (
            <textarea
              id={fieldName}
              name={fieldName}
              className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 resize-none"
              rows="3"
              value={pdvData[fieldName]}
              onChange={handleChange}
            />
          ) : (
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
              value={pdvData[fieldName]}
              onChange={handleChange}
            />
          )}
          <div className="flex justify-end mt-2">
            <button
              onClick={handleSaveField}
              className="bg-green-500 text-white py-1 px-3 rounded-md"
            >
              Guardar
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg py-2 px-3">
          <span className="text-gray-900">{pdvData[fieldName] || '-'}</span>
          <button
            onClick={() => setEditingField(fieldName)}
            className="text-tigo-blue text-sm underline flex items-center space-x-1"
          >
            <span>✎</span>
            <span>Editar</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
    <div className="p-6 bg-white rounded-xl shadow-lg mx-auto mt-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 text-center flex-1">
          Actualizar Datos del PDV
        </h2>
        <button
          onClick={handleAddNewData}
          className="ml-4 text-sm text-tigo-blue underline whitespace-nowrap"
        >
          ➕ Añadir nuevos datos
        </button>
      </div>

      <div className="md:flex md:space-x-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Datos actuales del PDV</h3>
          {renderField('Nombre de Contacto', 'contactName')}
          {renderField('Teléfono de Contacto', 'contactPhone')}
          {renderField('Ciudad', 'city')}
          {renderField('Dirección', 'address', true)}
          {renderField('Notas Internas', 'notes', true)}

          {pdvData.additionalFields.map((field, index) => (
            <div className="mb-4" key={index}>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {field.label}:
              </label>
              {editingField === `additional-${index}` ? (
                <>
                  <input
                    type="text"
                    className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 mb-2"
                    value={field.label}
                    onChange={(e) =>
                      handleAdditionalFieldChange(index, 'label', e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
                    value={field.value}
                    onChange={(e) =>
                      handleAdditionalFieldChange(index, 'value', e.target.value)
                    }
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={handleSaveAdditionalField}
                      className="bg-green-500 text-white py-1 px-3 rounded-md"
                    >
                      Guardar
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg py-2 px-3">
                  <span className="text-gray-900">{field.value || '-'}</span>
                  <button
                    onClick={() => setEditingField(`additional-${index}`)}
                    className="text-tigo-blue text-sm underline flex items-center space-x-1"
                  >
                    <span>✎</span>
                    <span>Editar</span>
                  </button>
                </div>
              )}
            </div>
          ))}


          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveDefault"
              checked={saveAsDefault}
              disabled={matchedDefaultIndex !== -1}
              onChange={(e) => setSaveAsDefault(e.target.checked)}
            />
            <label htmlFor="saveDefault" className="text-sm text-gray-700">
              Guardar y establecer como datos predeterminados
            </label>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-tigo-cyan text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00a7d6] transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Guardar Cambios
          </button>
        </div>

        {pdvDefaultsList.length > 0 && (
          <div className="mt-6 md:mt-0 md:w-1/3 bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Predeterminados disponibles</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar PDV..."
              className="mb-4 w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
            />
            <ul className="space-y-4 text-sm max-h-80 overflow-y-auto scroll-smooth">
              {pdvDefaultsList
                .filter((def) =>
                  `${def.contactName} ${def.city} ${def.contactPhone}`
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((def, idx) => (
                <li key={idx} className="border border-gray-200 rounded-md p-2">
                  <p className="font-semibold mb-1">{def.autoLabel || `${def.city} – ${def.contactName}`}</p>
                  <p>
                    <span className="font-medium">Nombre de Contacto:</span> {def.contactName || '-'}
                  </p>
                  <p>
                    <span className="font-medium">Teléfono:</span> {def.contactPhone || '-'}
                  </p>
                  <p>
                    <span className="font-medium">Ciudad:</span> {def.city || '-'}
                  </p>
                  <p>
                    <span className="font-medium">Dirección:</span> {def.address || '-'}
                  </p>
                  <p className="text-xs text-gray-500">{new Date(def.savedAt).toLocaleString()}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleApplyDefaults(def)}
                      className="flex-1 bg-green-500 text-white py-1 px-2 rounded-md flex items-center justify-center space-x-1"
                    >
                      <span>✔</span>
                      <span>Aplicar</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDefaults(idx)}
                      className="flex-1 bg-red-500 text-white py-1 px-2 rounded-md flex items-center justify-center space-x-1"
                    >
                      <span>🗑</span>
                      <span>Eliminar</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div> 
    {showConfirm && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4">
          <h3 className="text-lg font-semibold mb-2">Confirmar cambios</h3>
          <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
            <p>
              <span className="font-medium">Nombre de Contacto:</span> {pdvData.contactName || '-'}
            </p>
            <p>
              <span className="font-medium">Teléfono:</span> {pdvData.contactPhone || '-'}
            </p>
            <p>
              <span className="font-medium">Ciudad:</span> {pdvData.city || '-'}
            </p>
            <p>
              <span className="font-medium">Dirección:</span> {pdvData.address || '-'}
            </p>
            <p>
              <span className="font-medium">Notas:</span> {pdvData.notes || '-'}
            </p>
            {pdvData.additionalFields.map((f, i) => (
              <p key={i}>
                <span className="font-medium">{f.label}:</span> {f.value || '-'}
              </p>
            ))}
          </div>
          {saveAsDefault && (
            <p className="mt-3 text-sm">
              {defaultAction === 'replace'
                ? 'Se reemplazará un conjunto de datos predeterminados existente.'
                : 'Se guardará como nuevo conjunto de datos predeterminados.'}
            </p>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button onClick={() => setShowConfirm(false)} className="bg-gray-300 text-gray-700 py-1 px-3 rounded-md">
              Revisar otra vez
            </button>
            <button onClick={finalizeSubmit} className="bg-tigo-cyan text-white py-1 px-3 rounded-md">
              Sí, guardar
            </button>
          </div>
        </div>
      </div>
    )}
    {showNewDataModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
        <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md p-4">
          <h3 className="text-lg font-semibold mb-2">
            No hay datos registrados. ¿Desea crear nuevos?
          </h3>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowNewDataModal(false)}
              className="bg-gray-300 text-gray-700 py-1 px-3 rounded-md"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                setShowNewDataModal(false);
                setSaveAsDefault(true);
                setShowConfirm(true);
              }}
              className="bg-tigo-cyan text-white py-1 px-3 rounded-md"
            >
              Sí
            </button>
          </div>
        </div>
      </div>
    )}
    </> 
  );
};
export default PdvUpdateForm;