import React, { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

const PdvUpdateForm = ({ selectedPdvId, onUpdateConfirm }) => {
  const [pdvData, setPdvData] = useState({
    contactName: '',
    contactPhone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    // Cargar datos existentes del PDV si los hay
    const storedPdvData = getStorageItem(`pdv-${selectedPdvId}-data`);
    if (storedPdvData) {
      setPdvData(storedPdvData);
    } else {
      // Resetear si no hay datos previos
      setPdvData({
        contactName: '',
        contactPhone: '',
        address: '',
        notes: '',
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

  const handleSubmit = () => {
    setStorageItem(`pdv-${selectedPdvId}-data`, pdvData);
    onUpdateConfirm(pdvData);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Actualizar Datos del PDV</h2>

      <div className="mb-4">
        <label htmlFor="contactName" className="block text-gray-700 text-sm font-bold mb-2">Nombre de Contacto:</label>
        <input
          type="text"
          id="contactName"
          name="contactName"
          className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
          value={pdvData.contactName}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contactPhone" className="block text-gray-700 text-sm font-bold mb-2">Teléfono de Contacto:</label>
        <input
          type="tel"
          id="contactPhone"
          name="contactPhone"
          className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
          value={pdvData.contactPhone}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">Dirección:</label>
        <textarea
          id="address"
          name="address"
          className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 resize-none"
          rows="3"
          value={pdvData.address}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="mb-6">
        <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notas Internas:</label>
        <textarea
          id="notes"
          name="notes"
          className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 resize-none"
          rows="3"
          value={pdvData.notes}
          onChange={handleChange}
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Guardar Cambios
      </button>
    </div>
  );
};

export default PdvUpdateForm;