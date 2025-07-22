import React, { useState, useEffect } from 'react';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
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
  // Datos predeterminados almacenados para el PDV
  const [pdvDefaults, setPdvDefaults] = useState(null);

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

    const storedDefaults = getStorageItem(`pdv-${selectedPdvId}-defaults`);
    setPdvDefaults(storedDefaults || null);
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

  // Guarda los datos predeterminados del PDV en localStorage
  const savePdvDefaults = (data) => {
    setPdvDefaults(data);
    setStorageItem(`pdv-${selectedPdvId}-defaults`, data);
  };

  // Finaliza la edición de un campo
  const handleSaveField = () => {
    setEditingField(null);
  };

  // Finaliza la edición de un campo adicional
  const handleSaveAdditionalField = () => {
    setEditingField(null);
  };

  // Aplica los valores predeterminados almacenados al formulario
  const handleApplyDefaults = () => {
    if (pdvDefaults) {
      setPdvData(pdvDefaults);
    }
  };

  // Elimina los valores predeterminados guardados
  const handleClearDefaults = () => {
    removeStorageItem(`pdv-${selectedPdvId}-defaults`);
    setPdvDefaults(null);
  };

  // Guarda la información editada y notifica al componente padre
  const handleSubmit = () => {
    setStorageItem(`pdv-${selectedPdvId}-data`, pdvData);
    savePdvDefaults(pdvData);

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

          <button
            onClick={handleSubmit}
            className="w-full bg-tigo-cyan text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00a7d6] transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Guardar Cambios
          </button>
        </div>

        {pdvDefaults && (
          <div className="mt-6 md:mt-0 md:w-1/3 bg-gray-50 border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Datos predeterminados del PDV</h3>
            <ul className="text-sm space-y-1">
              <li>
                <span className="font-medium">Nombre de Contacto:</span>{' '}
                {pdvDefaults.contactName || '-'}
              </li>
              <li>
                <span className="font-medium">Teléfono de Contacto:</span>{' '}
                {pdvDefaults.contactPhone || '-'}
              </li>
              <li>
                <span className="font-medium">Ciudad:</span> {pdvDefaults.city || '-'}
              </li>
              <li>
                <span className="font-medium">Dirección:</span>{' '}
                {pdvDefaults.address || '-'}
              </li>
              <li>
                <span className="font-medium">Notas Internas:</span>{' '}
                {pdvDefaults.notes || '-'}
              </li>
            </ul>
            <div className="mt-4 space-y-2">
              <button
                onClick={handleApplyDefaults}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md"
              >
                Aplicar datos predeterminados
              </button>
              <button
                onClick={handleClearDefaults}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md"
              >
                Eliminar datos predeterminados
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdvUpdateForm;
