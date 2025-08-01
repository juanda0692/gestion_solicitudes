import React, { useState, useEffect } from 'react';
import { materials } from '../mock/materials';
import { campaigns as defaultCampaigns } from '../mock/campaigns';
import { channels } from '../mock/channels';
import { channelMaterials } from '../mock/channelMaterials';
import ContextInfo from './ContextInfo';
import SingleSelectModal from './SingleSelectModal';
import PreviousCampaignsModal from './PreviousCampaignsModal';



/**
 * Formulario para solicitar material POP.
 *
 * Utiliza un pequeño "carrito" para acumular ítems antes de confirmar.
 * Actualmente trabaja con datos simulados. Para la integración,
 * reemplazar la obtención de `materials` y enviar el carrito al backend
 * dentro de `handleConfirmCart`.
 */

// Zonas disponibles para solicitar material
const zones = ['Fachada', 'Zona de experiencia', 'Mesas asesores'];
// Prioridades definidas por el negocio
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
  const channelName = channels.find((c) => c.id === selectedChannelId)?.name || selectedChannelId;
  // Estado del formulario
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedMeasures, setSelectedMeasures] = useState('');
  const [customMeasure, setCustomMeasure] = useState('');
  const [notes, setNotes] = useState('');
  const [cart, setCart] = useState([]);
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedZones, setSelectedZones] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('');

  const [campaignList, setCampaignList] = useState([]);
  const [campaignSearch, setCampaignSearch] = useState('');
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showPreviousModal, setShowPreviousModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Reiniciar la medida seleccionada al cambiar el material
  useEffect(() => {
    setSelectedMeasures('');
    setCustomMeasure('');
  }, [selectedMaterial]);

  const allowedMaterials = channelMaterials[selectedChannelId] || [];
  const allowedIds = allowedMaterials.map((m) => m.id);
  const cotizableMaterials = materials.filter(
    (m) =>
      m.requiresCotizacion &&
      (m.canalesPermitidos || []).includes(selectedChannelId),
  );
  const materialsForChannel = materials
    .filter(
      (m) =>
        allowedIds.includes(m.id) ||
        (m.requiresCotizacion &&
          (m.canalesPermitidos || []).includes(selectedChannelId)),
    )
    .map((m) => ({
      ...m,
      stock: allowedMaterials.find((am) => am.id === m.id)?.stock || m.stock,
    }));

  // Medidas disponibles según el material seleccionado
  const availableMeasures = React.useMemo(() => {
    const material = materials.find((m) => m.id === selectedMaterial);
    const base = material?.medidas || [];
    const opts = base.map((m) => ({ id: m, name: m }));
    opts.push({ id: 'otro', name: 'Otro' });
    return opts;
  }, [selectedMaterial]);
  // Cargar campañas guardadas localmente para mostrarlas en el desplegable
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('campaigns'));
    setCampaignList(stored || defaultCampaigns);
  }, []);

  // Agrega el material actual al carrito de la solicitud
  const handleAddToCart = () => {
    const materialDetails = materials.find((m) => m.id === selectedMaterial);
    const isAllowed =
      allowedIds.includes(selectedMaterial) ||
      (materialDetails?.requiresCotizacion &&
        (materialDetails.canalesPermitidos || []).includes(selectedChannelId));
    if (
      selectedMaterial &&
      quantity > 0 &&
      (selectedMeasures || customMeasure) &&
      isAllowed
    ) {
      const measureDetails =
        selectedMeasures === 'otro'
          ? { id: 'otro', name: customMeasure || 'Personalizado' }
          : { id: selectedMeasures, name: selectedMeasures };
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
      setCustomMeasure('');
      setNotes('');
    } else {
      alert(
        'Por favor, selecciona un material válido del canal, medidas y una cantidad correcta.',
      );
    }
  };

  // Elimina un elemento del carrito
  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Vacía por completo el carrito de materiales
  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddPreviousItems = (req) => {
    const newItems = req.items.map((item) => ({
      ...item,
      id: `${item.material.id}-${Date.now()}-${Math.random()}`,
    }));
    const filtered = newItems.filter(
      (it) =>
        allowedIds.includes(it.material.id) ||
        (it.material.requiresCotizacion &&
          (it.material.canalesPermitidos || []).includes(selectedChannelId)),
    );
    if (filtered.length < newItems.length) {
      alert('Algunos materiales no pertenecen al canal actual y fueron omitidos');
    }
    setCart((prev) => [...prev, ...filtered]);
    if (req.campaigns && req.campaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(req.campaigns[0]);
    }
    setShowPreviousModal(false);
  };

  const handleOpenConfirm = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío. Agrega materiales antes de confirmar.');
      return;
    }
    if (
      selectedZones.length === 0 ||
      !selectedPriority ||
      !selectedCampaign
    ) {
      alert(
        'Por favor completa Zona, Prioridad y Nombre de campaña antes de continuar.'
      );
      return;
    }
    setShowConfirmModal(true);
  };

  // Envía la solicitud al componente padre cuando el carrito tiene información
  const handleConfirmCart = () => {
    if (cart.length > 0) {
      // Aquí se podría enviar el contenido del carrito a un servicio REST
      onConfirmRequest({
        pdvId: selectedPdvId,
        zones: selectedZones,
        priority: selectedPriority,
        campaigns: selectedCampaign ? [selectedCampaign] : [],
        channelId: selectedChannelId,
        items: cart,
      });
    }
    setShowConfirmModal(false);
  };

  return (

    <div
      className={`p-6 bg-white rounded-xl shadow-lg mx-auto mt-8 grid gap-8 ${tradeType === 'regional' ? 'max-w-4xl md:grid-cols-3' : 'max-w-2xl md:grid-cols-2'}`}
    >

      {/* Sección de Formulario de Solicitud */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Solicitar Material POP</h2>

        <p className="text-center text-sm text-gray-600 mb-4">
          PDV: {selectedPdvName} - {selectedSubName} - {selectedRegionName} - Canal: {channelName}
        </p>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Material</h3>
          <button
            type="button"
            onClick={() => setShowMaterialModal(true)}
            className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg text-left"
          >
            {selectedMaterial
              ? materials.find((m) => m.id === selectedMaterial)?.name
              : 'Seleccionar material'}
          </button>
          {selectedMaterial && (
            <p className="text-sm text-gray-600 mt-1">
              {materials.find((m) => m.id === selectedMaterial)?.requiresCotizacion
                ? 'Este material será cotizado y producido bajo pedido por Trade Nacional.'
                : `Pertenece al canal ${channelName}. Stock disponible: ${
                    allowedMaterials.find((m) => m.id === selectedMaterial)?.stock || 0
                  }`}
            </p>
          )}
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
          {selectedMeasures === 'otro' && (
            <input
              type="text"
              className="mt-2 w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue transition-all"
              placeholder="Especifica las medidas"
              value={customMeasure}
              onChange={(e) => setCustomMeasure(e.target.value)}
            />
          )}
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
        <button
          onClick={() => setShowPreviousModal(true)}
          className="w-full mt-2 bg-indigo-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Solicitar campañas anteriores
        </button>
      </div>

      {/* Sección del Carrito y contexto */}
      <div className="border-l border-gray-200 pl-8 md:pl-4">
        <ContextInfo
          pdvName={selectedPdvName}
          subterritoryName={selectedSubName}
          regionName={selectedRegionName}
          channelId={selectedChannelId}
        />
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
                onClick={handleOpenConfirm}
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
            <div>
              <h3 className="font-semibold mb-2">Campaña</h3>
              <button
                type="button"
                onClick={() => setShowCampaignModal(true)}
                className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg text-left"
              >
                {selectedCampaign
                  ? campaignList.find((c) => c.id === selectedCampaign)?.name
                : 'Selecciona una campaña'}
            </button>
          </div>
        </div>
      )}

      {showMaterialModal && (
        <SingleSelectModal
          title="Seleccionar material"
          items={materialsForChannel}
          selectedId={selectedMaterial}
          onSelect={setSelectedMaterial}
          search={materialSearch}
          setSearch={setMaterialSearch}
          onClose={() => setShowMaterialModal(false)}
          placeholder="Buscar material"
        />
      )}

      {showCampaignModal && (
        <SingleSelectModal
          title="Seleccionar campaña"
          items={campaignList}
          selectedId={selectedCampaign}
          onSelect={setSelectedCampaign}
          search={campaignSearch}
          setSearch={setCampaignSearch}
          onClose={() => setShowCampaignModal(false)}
          placeholder="Buscar campaña"
        />
      )}

      {showPreviousModal && (
        <PreviousCampaignsModal
          pdvId={selectedPdvId}
          onSelect={handleAddPreviousItems}
          onClose={() => setShowPreviousModal(false)}
        />
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Confirmar solicitud</h3>
            <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
              <p className="font-medium">PDV: {selectedPdvName}</p>
              <p>Región: {selectedRegionName}</p>
              <p>Subterritorio: {selectedSubName}</p>
              <p>Canal: {channelName}</p>
              <p className="font-medium mt-2">Materiales:</p>
              {cart.map((item) => (
                <div key={item.id} className="border-t pt-1 mt-1">
                  <p>{item.material.name}</p>
                  <p className="text-xs">Medidas: {item.measures.name}</p>
                  <p className="text-xs">Cantidad: {item.quantity}</p>
                  {item.notes && (
                    <p className="text-xs">Notas: {item.notes}</p>
                  )}
                </div>
              ))}
              <p className="mt-2">
                <span className="font-medium">Zonas:</span> {selectedZones.join(', ')}
              </p>
              <p>
                <span className="font-medium">Prioridad:</span> {selectedPriority}
              </p>
              <p>
                <span className="font-medium">Campaña:</span>{' '}
                {campaignList.find((c) => c.id === selectedCampaign)?.name}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-300 text-gray-700 py-1 px-3 rounded-md"
              >
                Revisar otra vez
              </button>
              <button
                onClick={handleConfirmCart}
                className="bg-tigo-cyan text-white py-1 px-3 rounded-md"
              >
                Sí, confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequestForm;
