import React, { useState } from 'react';

/**
 * Componente principal de la aplicación.
 *
 * Maneja la navegación entre pantallas y guarda en estado la
 * selección actual del usuario (trade, canal, PDV, etc.).
 *
 * Todas las acciones que finalmente requerirán comunicación con el
 * backend (solicitud de material, actualización de PDV, consulta de
 * registros) se resuelven aquí usando datos simulados almacenados en
 * localStorage. Al conectar con un API real, estas funciones serán los
 * puntos de entrada para realizar llamadas HTTP.
 */
import LayoutHeader from './components/LayoutHeader';
import LayoutFooter from './components/LayoutFooter';
import ChannelSelector from './components/ChannelSelector';
import LocationSelector from './components/LocationSelector';
import MaterialRequestForm from './components/MaterialRequestForm';
import PdvUpdateForm from './components/PdvUpdateForm';
import ConfirmationMessage from './components/ConfirmationMessage';
import PreviousRequests from './components/PreviousRequests';
import ChannelRequests from './components/ChannelRequests';
import HomeMenu from './components/HomeMenu';
import CampaignsMenu from './components/CampaignsMenu';
import CreateCampaignForm from './components/CreateCampaignForm';
import ManageCampaigns from './components/ManageCampaigns';
import { getStorageItem, setStorageItem } from './utils/storage';

const App = () => {
  // Página o vista que se está mostrando actualmente
  // (home, selección de canal, formulario, etc.)
  const [currentPage, setCurrentPage] = useState('home');

  // Tipo de trade seleccionado ("nacional" o "regional")
  const [selectedTradeType, setSelectedTradeType] = useState('');

  // Identificador del canal seleccionado
  const [selectedChannelId, setSelectedChannelId] = useState('');

  // Identificador del PDV seleccionado
  const [selectedPdvId, setSelectedPdvId] = useState('');
  const [selectedPdvName, setSelectedPdvName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedRegionName, setSelectedRegionName] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedSubName, setSelectedSubName] = useState('');

  // Mensaje para la pantalla de confirmación
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Usuario selecciona si trabajará con Trade Nacional o Regional
  const handleSelectTrade = (type) => {
    setSelectedTradeType(type);
    setCurrentPage('channel-select');
  };

  // Después de elegir un canal, pasamos a seleccionar ubicación
  const handleSelectChannel = (channelId) => {
    setSelectedChannelId(channelId);
    setCurrentPage('location-select');
  };

  // Al escoger el PDV se habilitan las acciones disponibles
  const handleSelectPdv = ({
    pdvId,
    pdvName,
    regionId,
    regionName,
    subterritoryId,
    subterritoryName,
  }) => {
    setSelectedPdvId(pdvId);
    setSelectedPdvName(pdvName);
    setSelectedRegionId(regionId);
    setSelectedRegionName(regionName);
    setSelectedSubId(subterritoryId);
    setSelectedSubName(subterritoryName);
    setCurrentPage('pdv-actions');
  };

  // Navegar al formulario de solicitud de material POP
  const handleRequestMaterial = () => {
    setCurrentPage('request-material');
  };

  // Navegar al formulario de actualización de información del PDV
  const handleUpdatePdv = () => {
    setCurrentPage('update-pdv');
  };

  // Mostrar solicitudes o actualizaciones previas realizadas para el PDV
  const handleViewRequests = () => {
    setCurrentPage('previous-requests');
  };

  // Consultar todas las solicitudes hechas en un canal específico
  const handleViewChannelRequests = (channelId) => {
    setSelectedChannelId(channelId);
    setCurrentPage('channel-requests');
  };

  // Exporta en un archivo JSON las solicitudes y actualizaciones del PDV
  const handleExportData = () => {
    const materialRequests = getStorageItem('material-requests') || [];
    const updateRequests = getStorageItem('pdv-update-requests') || [];
    const data = {
      pdvId: selectedPdvId,
      materialRequests: materialRequests.filter((r) => r.pdvId === selectedPdvId),
      updateRequests: updateRequests.filter((r) => r.pdvId === selectedPdvId),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPdvId}-data.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Confirmación de carrito: aquí se guardan los datos en localStorage.
  // Reemplazar esta lógica por una llamada al backend al integrar APIs.
  const handleConfirmRequest = (requestDetails) => {
    const requestWithDate = { ...requestDetails, date: new Date().toISOString() };
    console.log('Solicitud de Material Confirmada:', requestWithDate);
    const existing = getStorageItem('material-requests') || [];
    setStorageItem('material-requests', [...existing, requestWithDate]);
    setConfirmationMessage('¡Tu solicitud de material ha sido enviada con éxito!');
    setCurrentPage('confirm-request');
  };

  // Se ejecuta al confirmar el formulario de actualización de PDV.
  // Actualmente se guarda en localStorage y muestra confirmación.
  // Con backend, aquí se enviaría la información actualizada.
  const handleUpdateConfirm = (updatedData) => {
    console.log('Datos del PDV Actualizados:', updatedData);
    setConfirmationMessage('¡Los datos del PDV han sido actualizados correctamente!');
    setCurrentPage('confirm-update');
  };

  // Vuelve a la pantalla inicial y limpia la selección actual
  const handleGoHome = () => {
    setCurrentPage('home');
    setSelectedTradeType('');
    setSelectedChannelId('');
    setSelectedPdvId('');
    setSelectedPdvName('');
    setSelectedRegionId('');
    setSelectedRegionName('');
    setSelectedSubId('');
    setSelectedSubName('');
    setConfirmationMessage('');
  };

  // Devuelve el título que debe mostrar el encabezado según la vista actual
  const getHeaderTitle = () => {
    switch (currentPage) {
      case 'home':
        return 'Base de Destinatarios';
      case 'trade-nacional':
      case 'trade-regional':
        return `Gestión ${selectedTradeType === 'nacional' ? 'Nacional' : 'Regional'}`;
      case 'channel-select':
        return 'Selección de Canal';
      case 'location-select':
        return 'Selección de Ubicación';
      case 'pdv-actions':
        return `Acciones para ${selectedPdvName || selectedPdvId}`;
      case 'request-material':
        return 'Solicitar Material';
      case 'update-pdv':
        return 'Actualizar PDV';
      case 'campaigns-menu':
        return 'Campañas';
      case 'create-campaign':
        return 'Crear Campaña';
      case 'manage-campaigns':
        return 'Gestionar Campañas';
      case 'previous-requests':
        return 'Solicitudes Anteriores';
      case 'channel-requests':
        return 'Solicitudes por Canal';
      case 'confirm-request':
      case 'confirm-update':
        return 'Confirmación';
      default:
        return 'Base de Destinatarios';
    }
  };

  // Navegación inversa según la página en la que estemos
  const handleBack = () => {
    switch (currentPage) {
      case 'channel-select':
        setCurrentPage('home');
        break;
      case 'location-select':
        setCurrentPage('channel-select');
        break;
      case 'pdv-actions':
        setCurrentPage('location-select');
        break;
      case 'request-material':
      case 'update-pdv':
        setCurrentPage('pdv-actions');
        break;
      case 'previous-requests':
        setCurrentPage('pdv-actions');
        break;
      case 'channel-requests':
        setCurrentPage('channel-select');
        break;
      case 'campaigns-menu':
        setCurrentPage('pdv-actions');
        break;
      case 'create-campaign':
      case 'manage-campaigns':
        setCurrentPage('campaigns-menu');
        break;
      case 'confirm-request':
      case 'confirm-update':
        setCurrentPage('home');
        break;
      default:
        setCurrentPage('home');
    }
  };

  return (
    // Contenedor general con encabezado fijo y área de contenido
    <div className="min-h-screen bg-tigo-light flex flex-col">
      <LayoutHeader title={getHeaderTitle()} onBack={currentPage !== 'home' ? handleBack : null} />

      <main className="flex-grow p-4 flex items-center justify-center">
        {/* Vista de inicio con selección de tipo de trade */}
        {currentPage === 'home' && (
          <HomeMenu onSelectTrade={handleSelectTrade} />
        )}

        {/* Listado de canales disponibles */}
        {currentPage === 'channel-select' && (
          <ChannelSelector onSelectChannel={handleSelectChannel} onViewChannelRequests={handleViewChannelRequests} />
        )}

        {/* Selección de región, subterritorio y PDV */}
        {currentPage === 'location-select' && (
          <LocationSelector onSelectPdv={handleSelectPdv} selectedChannel={selectedChannelId} />
        )}

        {/* Acciones disponibles para el PDV */}
        {currentPage === 'pdv-actions' && (
          <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acciones para {selectedPdvName}</h2>
            <div className="space-y-4">
              <button
                onClick={handleRequestMaterial}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Solicitar Material
              </button>
              <button
                onClick={handleUpdatePdv}
                className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Actualizar Datos del PDV
              </button>
              <button
                onClick={handleViewRequests}
                className="w-full bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Ver Solicitudes Anteriores
              </button>
              {selectedTradeType === 'nacional' && (
                <>
                  <button
                    onClick={() => setCurrentPage('campaigns-menu')}
                    className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Campañas
                  </button>
                  <button
                    onClick={handleExportData}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-gray-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    Exportar Datos
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Formulario para solicitar material */}
        {currentPage === 'request-material' && (
          <MaterialRequestForm
            onConfirmRequest={handleConfirmRequest}
            selectedPdvId={selectedPdvId}
            selectedPdvName={selectedPdvName}
            selectedRegionName={selectedRegionName}
            selectedSubName={selectedSubName}
            selectedChannelId={selectedChannelId}
            tradeType={selectedTradeType}
          />
        )}

        {/* Formulario para actualizar información del PDV */}
        {currentPage === 'update-pdv' && (
          <PdvUpdateForm selectedPdvId={selectedPdvId} onUpdateConfirm={handleUpdateConfirm} />
        )}

        {/* Historial de solicitudes para el PDV */}
        {currentPage === 'previous-requests' && (
          <PreviousRequests pdvId={selectedPdvId} onBack={handleBack} />
        )}

        {/* Historial de solicitudes por canal */}
        {currentPage === 'channel-requests' && (
          <ChannelRequests channelId={selectedChannelId} onBack={handleBack} />
        )}

        {/* Menú de campañas */}
        {currentPage === 'campaigns-menu' && (
          <CampaignsMenu onCreate={() => setCurrentPage('create-campaign')} onManage={() => setCurrentPage('manage-campaigns')} />
        )}

        {/* Crear campaña */}
        {currentPage === 'create-campaign' && (
          <CreateCampaignForm onBack={handleBack} />
        )}

        {/* Gestionar campañas */}
        {currentPage === 'manage-campaigns' && (
          <ManageCampaigns onBack={handleBack} />
        )}

        {/* Mensaje de confirmación de acciones */}
        {(currentPage === 'confirm-request' || currentPage === 'confirm-update') && (
          <ConfirmationMessage
            message={confirmationMessage}
            onGoHome={handleGoHome}
            onStayInChannel={() => setCurrentPage('location-select')}
          />
        )}
      </main>
      <LayoutFooter />
    </div>
  );
};

export default App;
