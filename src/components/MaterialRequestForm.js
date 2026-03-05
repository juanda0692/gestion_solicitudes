import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getChannels,
  getMaterialsByChannel,
  getCampaigns,
} from '../services/api';
import { createRequest } from '../services/requests';
import ContextInfo from './ContextInfo';
import SingleSelectModal from './SingleSelectModal';
import PreviousCampaignsModal from './PreviousCampaignsModal';
import { getDisplayName, formatQuantity } from '../utils/materialDisplay';
import { getStorageItem } from '../utils/storage';
import { createClientRequestId } from '../data/providers/shared';



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
// const priorities = ['Prioridad 1', 'Prioridad 2', 'Prioridad 3'];

const MaterialRequestForm = ({
  onConfirmRequest,
  onBackToPdv,
  selectedPdvId,
  selectedPdvName,
  selectedRegionId,
  selectedRegionName,
  selectedSubId,
  selectedSubName,
  selectedChannelId,
  tradeType,
  addToast
}) => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState([]);
  const [materials, setMaterials] = useState([]);
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
  const [pdvSnapshot, setPdvSnapshot] = useState({});
  const [expandCart, setExpandCart] = useState(true);

  // Reiniciar la medida seleccionada al cambiar el material
  useEffect(() => {
    setSelectedMeasures('');
    setCustomMeasure('');
  }, [selectedMaterial]);
  // Cargar catálogos desde la API
  useEffect(() => {
    getChannels().then(setChannels).catch(console.error);
  }, []);

  useEffect(() => {
  getCampaigns()
    .then(response => {
      // Assuming response is an array of campaign objects with id, name, and priority
      setCampaignList(response);
    })
    .catch(console.error);
}, []);

  useEffect(() => {
    if (!selectedChannelId) {
      setMaterials([]);
      return;
    }
    getMaterialsByChannel(selectedChannelId).then(setMaterials).catch(console.error);
  }, [selectedChannelId]);

  // Medidas disponibles según el material seleccionado
  const availableMeasures = React.useMemo(() => {
  const material = materials.find((m) => m.material_id === selectedMaterial);
  if (!material) return [{ id: 'otro', name: 'Otro' }];

  const defaultMeasure = String(material.medida_estandar || material.size || '').trim();
  const measures = defaultMeasure ? [{ id: defaultMeasure, name: defaultMeasure }] : [];
  measures.push({ id: 'otro', name: 'Otro' });

  return measures;
}, [selectedMaterial, materials]);

  // Agrega el material actual al carrito de la solicitud

  const handleAddToCart = () => {
	    if (!selectedMaterial || !selectedMeasures) {
	    alert('Por favor selecciona material y medidas');
	    return;
	  }

    if (selectedMeasures === 'otro' && !String(customMeasure || '').trim()) {
      alert('Debes especificar una medida personalizada');
      return;
    }
	
	  const material = materials.find((m) => m.material_id === selectedMaterial);
	  if (!material) {
	    alert('Material no encontrado');
    return;
  }

  // Stock validation
  if (quantity > material.stock) {
    alert(`La cantidad solicitada (${quantity}) supera el stock disponible (${material.stock})`);
    return;
  }

	  // Create measures object with the correct structure
	  const measuresObj = selectedMeasures === 'otro'
	    ? { id: 'otro', name: String(customMeasure || '').trim() }
	    : { id: selectedMeasures, name: selectedMeasures };

  const newItem = {
    id: `${Date.now()}`,
    material: {
      id: material.material_id,
      name: material.name,
      stock: material.stock
    },
    measures: measuresObj,
    quantity: quantity,
    notes: notes
  };
  setCart([...cart, newItem]);
  
  // Reset form
	  setSelectedMaterial('');
  setSelectedMeasures('');
  setCustomMeasure('');
  setQuantity(1);
  setNotes('');
  
  alert('Material agregado al carrito');
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
    setCart((prev) => [...prev, ...newItems]);
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
    if (!selectedChannelId) {
      alert('Debes seleccionar un canal antes de continuar.');
      return;
    }
    if (!selectedRegionName || !selectedSubName || !selectedPdvId) {
      alert('Selecciona Región, Subterritorio y PDV antes de confirmar.');
      return;
    }
  
    // Solo validar zona y campaña para trade regional
    if (tradeType === 'regional') {
      if (
        selectedZones.length === 0 ||
        !selectedPriority ||
        !selectedCampaign
      ) {
        alert(
          'Por favor completa Zona y Nombre de campaña antes de continuar.'
        );
        return;
      }
    }

    const snap = getStorageItem(`pdv-${selectedPdvId}-data`) || {};
    setPdvSnapshot({
      contactName: snap.contactName || '',
      contactPhone: snap.contactPhone || '',
      city: snap.city || '',
      address: snap.address || '',
      notes: snap.notes || '',
    });
    setShowConfirmModal(true);
  };

  // Envía la solicitud al componente padre cuando el carrito tiene información
const handleConfirmCart = async () => {
  if (cart.length === 0) {
    window?.showToast?.({
      title: 'Carrito vacío',
      description: 'Agrega al menos un material',
      variant: 'destructive',
    });
    return;
  }

  // Para tu preview local
  const itemsToStore = cart.map((item) => ({
    ...item,
    displayName: getDisplayName(item.material?.name ?? item.name ?? ''),
  }));

  // cuando seleccionas campaña en el modal/lista
const handleSelectCampaign = (campaignId) => {
  setSelectedCampaign(campaignId);
  const c = campaignList.find(x => x.id === campaignId);
  setSelectedPriority(Number(c?.prioridad || 0)); // 👈 fuerza number ya aquí
};

  // Construye payload usando TUS estados reales
  // const payload = {
  //   region_id: selectedRegionId || null,
  //   subterritorio_id: selectedSubId || null,
  //   pdv_id: selectedPdvId,                                    // 🔴 requerido
  //   campania_id: selectedCampaign || null,                    // string id o null
  //   prioridad: Number(selectedPriority) || 0,                 // conviértelo a número
  //   zonas: Array.isArray(selectedZones) ? selectedZones : null,
  //   observaciones: notes || '',
  //   creado_por: '',
  //   items: cart.map((item) => ({
  //     material_id: item.material?.id ?? item.id,              // cubre ambos casos
  //     cantidad: Number(item.qty) || 0,
  //     medida_etiqueta: item.labelSize ?? null,
  //     medida_custom: item.customSize ?? null,
  //     observaciones: item.note ?? null,
  //   })),
  // };

  const toInt = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;
  const priorityFromCampaign = Number(
  campaignList.find(c => c.id === selectedCampaign)?.prioridad ?? selectedPriority ?? 0
);

	const payload = {
	  client_request_id: createClientRequestId(),
	  region_id: selectedRegionId || null,
	  subterritorio_id: selectedSubId || null,
	  pdv_id: selectedPdvId,
	  canal_id: selectedChannelId,
	  campania_id: selectedCampaign || null,
  prioridad: priorityFromCampaign || 1, // ← número
  zonas: Array.isArray(selectedZones) ? selectedZones : null,
  observaciones: notes || '',
	  creado_por: '',    // TODO por vacío. Luego se debe validar con user
	  items: cart.map((it) => ({
	    material_id: it.material?.id ?? it.id,                   // cubre ambos
	    cantidad: toInt(it.qty ?? it.quantity, 0),               // ← número
	    medida_etiqueta: it.measures.id === 'otro' ? 'Otro' : (it.measures.name ?? null),
	    medida_custom:   it.measures.id === 'otro' ? (it.measures.name ?? null) : null,
	    observaciones:   it.observaciones   ?? it.note       ?? it.notes           ?? null,
	  })),
	};


  // Validaciones rápidas del formulario antes de crear la solicitud
  const clientErrors = [];
  if (!payload.pdv_id) clientErrors.push('Debes seleccionar un PDV');
  if (!payload.canal_id) clientErrors.push('Debes seleccionar un canal');
  if (!Array.isArray(payload.items) || payload.items.length === 0) clientErrors.push('Agrega al menos un material');
  if (payload.items.some(it => !it.material_id)) clientErrors.push('Cada ítem debe tener material_id');
  if (payload.items.some(it => typeof it.cantidad !== 'number' || it.cantidad < 0)) clientErrors.push('cantidad debe ser número ≥ 0');

  if (clientErrors.length) {
    window?.showToast?.({
      title: 'Formulario incompleto',
      description: clientErrors.join(' • '),
      variant: 'destructive',
    });
    return;
  }

  try {

      const res = await createRequest(payload);

      // ✅ toast de éxito
      addToast?.(`Solicitud creada`, 'success');

      // Mantiene el historial demo alineado con el nuevo provider fake.
      onConfirmRequest({
        pdvId: selectedPdvId,
        pdvName: selectedPdvName,
        regionName: selectedRegionName,
        subterritoryName: selectedSubName,
        campaignId: selectedCampaign || null,
        campaigns: selectedCampaign ? [selectedCampaign] : [],
        priority: priorityFromCampaign || 1,
        zone: selectedZones,
        items: itemsToStore,
        pdvSnapshot,
      });

      // cierra modal y navega a /success
      setShowConfirmModal(false);
      navigate('/confirm', {
        replace: true,
        state: {
          ok: true,
          solicitudId: res.solicitud_id || res.requestId,
          items: res.items_count ?? res.items ?? cart.length,
          channelId: selectedChannelId,
          pdvId: selectedPdvId,
          pdvName: selectedPdvName,
          tradeType,
        },
      });

    } catch (err) {
      const details = err?.body?.details;
      const msg = Array.isArray(details) && details.length
        ? details.join(' • ')
        : (err?.body?.error || err.message || 'Error al crear la solicitud');

      // ❌ toast de error
      addToast?.(msg, 'error');
      setShowConfirmModal(false);
      navigate("/confirm", { replace: true, state: { ok: false, error: msg } });
      // si quieres, también puedes mantener el modal abierto aquí
      // return;
    } 
    // finally {
    //   // si prefieres cerrarlo siempre, déjalo aquí:
    //   setShowConfirmModal(false);
    // }
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
  {(() => {
    const selected = materials.find(
      (m) => m.material_id === selectedMaterial
    );
    return selected
      ? getDisplayName(selected.name)
      : 'Seleccionar material';
  })()}
</button>
          {selectedMaterial && (
            <p className="text-sm text-gray-600 mt-1">
              {materials.find((m) => m.id === selectedMaterial)?.requiresCotizacion
                ? 'Este material será cotizado y producido bajo pedido por Trade Nacional.'
                : `Pertenece al canal ${channelName}. Stock disponible: ${
                    materials.find(m => m.material_id === selectedMaterial).stock || 0
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
	    <option value="">Selecciona una medida</option>
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
  {selectedMeasures && selectedMeasures !== 'otro' && (
    <p className="text-sm text-gray-600 mt-1">
      Medida estándar del material
    </p>
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
        {/* <button
          onClick={() => setShowPreviousModal(true)}
          className="w-full mt-2 bg-indigo-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Solicitar campañas anteriores
        </button> */}
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
                    {getDisplayName(item.material.name)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Medidas: {item.measures.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    Cantidad: {formatQuantity(item.material.name, item.quantity)}
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
          {/* <div>
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
            </div> */}
            {/* <div>
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
          </div> */}
          <div>
  <h3 className="font-semibold mb-2">Campaña</h3>
  <button
    type="button"
    onClick={() => setShowCampaignModal(true)}
    className="w-full bg-gray-100 border border-gray-300 py-2 px-3 rounded-lg text-left"
  >
    {(() => {
      const selected = campaignList.find(
        (c) => c.id === selectedCampaign
      );
      if (selected) {
        return (
          <div>
            <div>{selected.name}</div>
            <div className="text-sm text-gray-600">
              Prioridad: {selected.prioridad}
            </div>
          </div>
        );
      }
      return 'Selecciona una campaña';
    })()}
  </button>
</div>
        </div>
      )}

      {showMaterialModal && (
        <SingleSelectModal
          title="Seleccionar material"
          items={materials}
          selectedId={selectedMaterial}
          onSelect={setSelectedMaterial}
          search={materialSearch}
          setSearch={setMaterialSearch}
          onClose={() => setShowMaterialModal(false)}
          placeholder="Buscar material"
        />
      )}

      {/* {showCampaignModal && (
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
      )} */}
{showCampaignModal && (
  <SingleSelectModal
    title="Seleccionar campaña"
    items={campaignList.map(c => ({
      material_id: c.id, // Mapear id a material_id para compatibilidad
      name: c.name,
      prioridad: c.prioridad
    }))}
    selectedId={selectedCampaign}
	    onSelect={(id) => {
	      const campaign = campaignList.find(c => c.id === id);
	      if (campaign) {
	        setSelectedCampaign(id);
	        setSelectedPriority(Number(campaign.prioridad || 0));
	      }
	      setShowCampaignModal(false);
	    }}
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
            <h3 className="text-lg font-semibold mb-2">Confirmar solicitud completa</h3>
            <div className="text-sm space-y-1 max-h-60 overflow-y-auto">
              <p className="font-medium">Ubicación</p>
              <p>Región: {selectedRegionName}</p>
              <p>Subterritorio: {selectedSubName}</p>
              <p>PDV: {selectedPdvName}</p>
              <div className="mt-2">
                <p className="font-medium">PDV</p>
                {pdvSnapshot.contactName && (
                  <p>Contacto: {pdvSnapshot.contactName}</p>
                )}
                {pdvSnapshot.contactPhone && (
                  <p>Teléfono: {pdvSnapshot.contactPhone}</p>
                )}
                {pdvSnapshot.city && <p>Ciudad: {pdvSnapshot.city}</p>}
                {pdvSnapshot.address && <p>Dirección: {pdvSnapshot.address}</p>}
                {pdvSnapshot.notes && <p>Notas: {pdvSnapshot.notes}</p>}
              </div>
              <div className="mt-2">
                <button
                  className="text-tigo-blue text-sm"
                  onClick={() => setExpandCart((prev) => !prev)}
                >
                  Carrito ({cart.length}) {expandCart ? '▲' : '▼'}
                </button>
                {expandCart && (
                  <div className="mt-1">
                    {cart.map((item) => (
                      <div key={item.id} className="border-t pt-1 mt-1">
                        <p>{getDisplayName(item.material.name)}</p>
                        <p className="text-xs">Medidas: {item.measures.name}</p>
                        <p className="text-xs">Cantidad: {formatQuantity(item.material.name, item.quantity)}</p>
                        {item.notes && (
                          <p className="text-xs">Notas: {item.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              <p>
                <span className="font-medium">Fecha:</span> {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-4 flex-wrap">
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
              {onBackToPdv && (
                <button
                  onClick={() => {
                    setShowConfirmModal(false);
                    onBackToPdv();
                  }}
                  className="bg-gray-200 text-gray-800 py-1 px-3 rounded-md"
                >
                  Volver al PDV {selectedPdvName}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequestForm;
