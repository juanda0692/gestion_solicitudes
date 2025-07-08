import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

/**
 * Formulario para actualizar los datos de un Punto de Venta.
 *
 * Los cambios se almacenan de forma local como ejemplo. Al
 * conectar con un servicio real, las funciones de carga y guardado
 * deben invocar las API correspondientes.
 */

const PdvUpdateForm = ({ selectedPdvId, onUpdateConfirm }) => {
  const [pdvData, setPdvData] = useState({
    contactName: '',
    contactPhone: '',
    city: '',
    address: '',
    notes: '',
    additionalFields: [],
  });
  const [editingField, setEditingField] = useState(null);
  const [addingField, setAddingField] = useState(false);
  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');

  useEffect(() => {
    // Cargar datos existentes del PDV si los hay
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
      // Resetear si no hay datos previos
      setPdvData({
        contactName: '',
        contactPhone: '',
        city: '',
        address: '',
        notes: '',
        additionalFields: [],
      });
    }
  }, [selectedPdvId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPdvData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdditionalFieldChange = (index, key, value) => {
    setPdvData((prevData) => {
      const updated = [...prevData.additionalFields];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prevData, additionalFields: updated };
    });
  };

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;
    setPdvData((prevData) => ({
      ...prevData,
      additionalFields: [
        ...prevData.additionalFields,
        { label: newFieldLabel, value: newFieldValue },
      ],
    }));
    setNewFieldLabel('');
    setNewFieldValue('');
    setAddingField(false);
  };

  // Guarda los cambios en localStorage y notifica al componente padre.
  // Sustituir por una petición POST/PUT al backend cuando esté disponible.
  const handleSubmit = () => {
    setStorageItem(`pdv-${selectedPdvId}-data`, pdvData);

    const updates = getStorageItem('pdv-update-requests') || [];
    const updateEntry = {
      pdvId: selectedPdvId,
      data: pdvData,
      date: new Date().toISOString(),
    };
    setStorageItem('pdv-update-requests', [...updates, updateEntry]);

    onUpdateConfirm(pdvData);
  };

  const renderField = (label, fieldName, multiline = false) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}:</label>
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
              onClick={() => setEditingField(null)}
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
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Actualizar Datos del PDV
      </h2>

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
                  onClick={() => setEditingField(null)}
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
  );
};

export default PdvUpdateForm;
