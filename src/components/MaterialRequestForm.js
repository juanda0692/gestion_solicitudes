import React, { useState, useEffect } from 'react';
import { materials } from '../mock/materials';

import { campaigns as defaultCampaigns } from '../mock/campaigns';

import { campaigns } from '../mock/campaigns';


/**
 * Formulario para solicitar material POP.
 *
 * Utiliza un pequeño "carrito" para acumular ítems antes de confirmar.
 * Actualmente trabaja con datos simulados. Para la integración,
 * reemplazar la obtención de `materials` y enviar el carrito al backend
 * dentro de `handleConfirmCart`.
 */

const zones = ['Fachada', 'Zona de experiencia', 'Mesas asesores'];
const priorities = ['Prioridad 1', 'Prioridad 2', 'Prioridad 3'];

const MaterialRequestForm = ({
  onConfirmRequest,
  selectedPdvId,
  selectedPdvName,
  selectedRegionName,
  selectedSubName,
  selectedChannelId,
  tradeType,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedMeasures, setSelectedMeasures] = useState('');
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState([]);
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);

  const [showCampaigns, setShowCampaigns] = useState(false);
  const [campaignList, setCampaignList] = useState([]);

  // Medidas predefinidas. Pueden ampliarse según necesidades del negocio.



  const availableMeasures = [
    { id: 'medida-1', name: '60x90 cm' },
    { id: 'medida-2', name: 'A5 (14.8x21 cm)' },
    { id: 'medida-3', name: '20x30 cm' },
    { id: 'medida-4', name: '200x80 cm' },
    { id: 'medida-5', name: 'Personalizado' },
  ];

  // Cargar campañas guardadas localmente para mostrarlas en el desplegable.
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('campaigns'));
    setCampaignList(stored || defaultCampaigns);
  }, []);

  // Agrega el material seleccionado al carrito
  const handleAddToCart = () => {
    if (selectedMaterial && quantity > 0 && selectedMeasures) {
      const materialDetails = materials.find((m) => m.id === selectedMaterial);
      const measureDetails = availableMeasures.find(
        (m) => m.id === selectedMeasures,
      );
      setCart((prevCart) => [
        ...prevCart,
        {
          id: `${materialDetails.id}-${Date.now()}`, // ID único para cada item en el carrito
          material: materialDetails,
          measures: measureDetails,
          quantity,
          notes,
        },
      ]);
      // Resetear formulario después de agregar al carrito
      setSelectedMaterial('');
      setQuantity(1);
      setSelectedMeasures('');
      setNotes('');
    } else {
      alert(
        'Por favor, selecciona un material, medidas y una cantidad válida.',
      );
    }
  };

  // Elimina un elemento del carrito
  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Vacía por completo el carrito
  const handleClearCart = () => {
    setCart([]);
  };

  // Al confirmar se llama a `onConfirmRequest` con todos los datos del carrito
  const handleConfirmCart = () => {
    if (cart.length > 0) {
      // Aquí se podría enviar el contenido del carrito a un servicio REST
      onConfirmRequest({
        pdvId: selectedPdvId,
        zones: selectedZones,
        priority: selectedPriority,
        campaigns: selectedCampaigns,
        channelId: selectedChannelId,
        items: cart,
      });
    } else {
      alert('El carrito está vacío. Agrega materiales antes de confirmar.');
    }
  };

  return (

    <div
      className={`p-6 bg-white rounded-xl shadow-lg mx-auto mt-8 grid gap-8 ${tradeType === 'regional' ? 'max-w-4xl md:grid-cols-3' : 'max-w-2xl md:grid-cols-2'}`}
    >
      {/* Sección de Formulario de Solicitud */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
          Solicitar Material POP
        </h2>

    <div className={`p-6 bg-white rounded-xl shadow-lg mx-auto mt-8 grid gap-8 ${tradeType === 'regional' ? 'max-w-4xl md:grid-cols-3' : 'max-w-2xl md:grid-cols-2'}`}> 
      {/* Sección de Formulario de Solicitud */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Solicitar Material POP</h2>

        <p className="text-center text-sm text-gray-600 mb-4">
          PDV: {selectedPdvName} - {selectedSubName} - {selectedRegionName}
        </p>

        <div className="mb-4">
          <label
            htmlFor="material-search"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Buscar Material:
          </label>
          <input
            type="text"
            id="material-search"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 mb-2"
            placeholder="Ingresa nombre del material"
            value={materialSearch}
            onChange={(e) => setMaterialSearch(e.target.value)}
          />
          <label
            htmlFor="material-select"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Material:
          </label>
          <select
            id="material-select"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
            value={selectedMaterial}
            onChange={(e) => setSelectedMaterial(e.target.value)}
          >
            <option value="">Selecciona un material</option>
            {materials
              .filter((material) =>
                material.name
                  .toLowerCase()
                  .includes(materialSearch.toLowerCase()),
              )
              .map((material) => (
                <option key={material.id} value={material.id}>
                  {material.name}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="measures-select"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Medidas:
          </label>
          <select
            id="measures-select"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
            value={selectedMeasures}
            onChange={(e) => setSelectedMeasures(e.target.value)}
          >
            <option value="">Selecciona las medidas</option>
            {availableMeasures.map((measure) => (
              <option key={measure.id} value={measure.id}>
                {measure.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="quantity-input"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cantidad:
          </label>
          <input
            type="number"
            id="quantity-input"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200"
            value={quantity}
            onChange={(e) =>
              setQuantity(Math.max(1, parseInt(e.target.value) || 1))
            }
            min="1"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="notes-textarea"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Notas Adicionales:
          </label>
          <textarea
            id="notes-textarea"
            className="block w-full bg-gray-100 border border-gray-300 text-gray-900 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all duration-200 resize-none"
            rows="3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Agregar al Carrito
        </button>
      </div>

      {/* Sección del Carrito */}
      <div className="border-l border-gray-200 pl-8 md:pl-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Carrito de Solicitud ({cart.length})
        </h2>
        {cart.length === 0 ? (
          <p className="text-gray-600 text-center">El carrito está vacío.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {item.material.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Medidas: {item.measures.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
            <div className="flex justify-between mt-6 space-x-4">
              <button
                onClick={handleClearCart}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Vaciar Carrito
              </button>
              <button
                onClick={handleConfirmCart}
                className="flex-1 bg-tigo-cyan text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#00a7d6] transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Confirmar Solicitud Completa
              </button>
            </div>
          </div>
        )}
      </div>

      {tradeType === 'regional' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Zona</h3>
            {zones.map((z) => (
              <label key={z} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={selectedZones.includes(z)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedZones([...selectedZones, z]);
                    } else {
                      setSelectedZones(selectedZones.filter((s) => s !== z));
                    }
                  }}
                />
                {z}
              </label>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Nombre de la prioridad</h3>
            <select
              className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >

                <option value="">Seleccione</option>
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <h3 className="font-semibold mb-2">Campaña</h3>
              <button
                type="button"
                onClick={() => setShowCampaigns((v) => !v)}
                className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg text-left flex justify-between items-center"
              >
                <span>
                  {selectedCampaigns.length > 0
                    ? `${selectedCampaigns.length} seleccionada${selectedCampaigns.length > 1 ? 's' : ''}`
                    : 'Selecciona campañas'}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showCampaigns && (
                <div className="absolute z-10 bg-white border border-gray-300 rounded-lg mt-2 w-full max-h-40 overflow-y-auto p-2 shadow-lg">
                  {campaignList.map((c) => (
                    <label key={c.id} className="block cursor-pointer">
                      <input
                        type="checkbox"
                        className="mr-2"
                        checked={selectedCampaigns.includes(c.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCampaigns([...selectedCampaigns, c.id]);
                          } else {
                            setSelectedCampaigns(
                              selectedCampaigns.filter((id) => id !== c.id),
                            );
                          }
                        }}
                      />
                      {c.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

              <option value="">Seleccione</option>
              {priorities.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Campaña</h3>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {campaigns.map((c) => (
                <label key={c.id} className="block">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedCampaigns.includes(c.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCampaigns([...selectedCampaigns, c.id]);
                      } else {
                        setSelectedCampaigns(selectedCampaigns.filter((id) => id !== c.id));
                      }
                    }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default MaterialRequestForm;
