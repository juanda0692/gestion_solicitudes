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
  // Controla la visualización del formulario para agregar campos extra
  const [addingField, setAddingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  // Conjunto de datos predeterminados almacenados para el PDV
  const [pdvDefaultsList, setPdvDefaultsList] = useState([]);
  // Permite indicar si los cambios actuales se deben guardar como predeterminados
  const [saveAsDefault, setSaveAsDefault] = useState(false);

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

  // Agrega un nuevo campo adicional al formulario
  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    setPdvData((prev) => ({
      ...prev,
      additionalFields: [
        ...prev.additionalFields,
        { label: newFieldLabel, value: newFieldValue },
      ],
    }));
    setNewFieldLabel('');
    setNewFieldValue('');
    setAddingField(false);
  };

  // Guarda un conjunto de datos predeterminados para el PDV
  const savePdvDefaults = (data) => {
    const list = getStorageItem(`pdv-${selectedPdvId}-defaults-list`) || [];
    const entry = { ...data, savedAt: new Date().toISOString() };
    const newList = [...list, entry];
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
    }
  };

  // Elimina un conjunto de valores predeterminados guardados
  const handleDeleteDefaults = (index) => {
    const updated = [...pdvDefaultsList];
    updated.splice(index, 1);
    setPdvDefaultsList(updated);
    setStorageItem(`pdv-${selectedPdvId}-defaults-list`, updated);
  };

  // Guarda la información editada y notifica al componente padre
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

    setStorageItem(`pdv-${selectedPdvId}-data`, pdvData);
    if (saveAsDefault) {
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
            className="text-tigo-blue text-sm underline"
          >
            Editar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mx-auto mt-8 max-w-3xl">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Actualizar Datos del PDV
      </h2>

      <div className="md:flex md:space-x-6">
        <div className="flex-1">
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
                    className="text-tigo-blue text-sm underline"
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))}

          {addingField ? (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Nombre del Campo"
                className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 mb-2"
                value={newFieldLabel}
                onChange={(e) => setNewFieldLabel(e.target.value)}
              />
              <input
                type="text"
                placeholder="Valor"
                className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 mb-2"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  onClick={() => {
                    setAddingField(false);
                    setNewFieldLabel('');
                    setNewFieldValue('');
                  }}
                  className="bg-gray-300 text-gray-700 py-1 px-3 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddField}
                  className="bg-green-500 text-white py-1 px-3 rounded-md"
                >
                  Agregar
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <button
                onClick={() => setAddingField(true)}
                className="bg-tigo-cyan text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#00a7d6] transition-all duration-300"
              >
                Agregar Campo
              </button>
            </div>
          )}

          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="saveDefault"
              checked={saveAsDefault}
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
          <div className="mt-6 md:mt-0 md:w-1/3 bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Datos predeterminados del PDV</h3>
            <ul className="space-y-4 text-sm max-h-80 overflow-y-auto">
              {pdvDefaultsList.map((def, idx) => (
                <li key={idx} className="border-b pb-2">
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
                      className="flex-1 bg-green-500 text-white py-1 px-2 rounded-md"
                    >
                      Aplicar
                    </button>
                    <button
                      onClick={() => handleDeleteDefaults(idx)}
                      className="flex-1 bg-red-500 text-white py-1 px-2 rounded-md"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdvUpdateForm;