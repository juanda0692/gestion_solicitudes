import React, { useState, useEffect } from 'react';

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
import ExportData from './components/ExportData';
import LoginScreen from './components/LoginScreen';
import ChannelMenu from './components/ChannelMenu';
import Sidebar from './components/Sidebar';
import { getStorageItem, setStorageItem } from './utils/storage';
import { sanitizeOnBoot } from './utils/cleanupLocalStorage';
import exportToExcel from './utils/exportToExcel';
import exportToJson from './utils/exportToJson';
import exportPdvs from './utils/exportPdvs';
import { getChannels } from './services/api';
import { getActiveLocations } from './utils/locationsSource';
import { useToast } from './components/ui/ToastProvider';

const App = () => {
  // Controla si el usuario ha iniciado sesión
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Página o vista que se está mostrando actualmente
  // (home, selección de canal, formulario, etc.)
  const [currentPage, setCurrentPage] = useState('login');

  // Tipo de trade seleccionado ("nacional" o "regional")
  const [selectedTradeType, setSelectedTradeType] = useState('');

  // Identificador del canal seleccionado
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [channelList, setChannelList] = useState([]);

  // Identificador del PDV seleccionado
  const [selectedPdvId, setSelectedPdvId] = useState('');
  const [selectedPdvName, setSelectedPdvName] = useState('');
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedRegionName, setSelectedRegionName] = useState('');
  const [selectedSubId, setSelectedSubId] = useState('');
  const [selectedSubName, setSelectedSubName] = useState('');

  // Mensaje para la pantalla de confirmación
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const addToast = useToast();

  // Limpieza y saneamiento inicial de localStorage
  useEffect(() => {
    const { pdvs } = getActiveLocations();
    const validIds = Object.values(pdvs)
      .flat()
      .filter((p) => p.complete)
      .map((p) => p.id);
    const report = sanitizeOnBoot(validIds);
    if (process.env.NODE_ENV === 'development') {
      console.log('sanitizeOnBoot report', report);
    }
  }, []);

  // Cargar canales disponibles desde LocalStorage
  useEffect(() => {
    getChannels().then(setChannelList).catch(console.error);
  }, []);

  // Usuario selecciona si trabajará con Trade Nacional o Regional
  const handleSelectTrade = (type) => {
    setSelectedTradeType(type);
    setCurrentPage('channel-select');
  };

  // Después de elegir un canal se muestra el menú de canal
  const handleSelectChannel = (channelId) => {
    setSelectedChannelId(channelId);
    setCurrentPage('channel-menu');
  };

  // Desde el menú del canal se continúa a la selección de ubicación
  const handleManageChannel = () => {
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

  // Navegar a la pantalla de exportación de datos
  const handleExportData = () => {
    setCurrentPage('export-data');
  };

  // Navegar directamente al formulario de creación de campaña
  const handleCreateCampaign = () => {
    setCurrentPage('create-campaign');
  };

  // Exporta la información a un archivo Excel utilizando la utilidad dedicada.
  /**
   * Ejecuta la exportación de datos.
   * Por defecto solo genera Excel, pero puede opcionalmente crear
   * un archivo JSON según la configuración recibida.
   *
   * @param {Object} exportObj - datos a exportar
   * @param {Object} [options]
   * @param {boolean} [options.excel=true] - generar archivo Excel
   * @param {boolean} [options.json=false] - generar archivo JSON
   */
  const performExport = (exportObj, options = {}) => {
    const { excel = true, json = false } = options;
    let ok = true;
    if (excel) {
      if (exportObj?.meta?.type === 'pdv-list') {
        // Exportación de PDVs (modo demo)
        ok = exportPdvs(exportObj) && ok; // TODO backend/export
      } else {
        ok = exportToExcel(exportObj) && ok;
      }
    }
    if (json) ok = exportToJson(exportObj) && ok;

    if (ok) {
      addToast('Exportación completada');
    } else {
      addToast('No se pudo generar el archivo. Intenta de nuevo.', 'error');
    }
  };

  // Confirmación de carrito: aquí se guardan los datos en localStorage.
  // Reemplazar esta lógica por una llamada al backend al integrar APIs.
  const handleConfirmRequest = (requestDetails) => {
    const requestWithDate = {
      ...requestDetails,
      pdvData: requestDetails.pdvSnapshot,
      date: new Date().toISOString(),
    };
    const existing = getStorageItem('material-requests') || [];
    setStorageItem('material-requests', [...existing, requestWithDate]);
    setConfirmationMessage(`Solicitud registrada para ${selectedPdvName}`);
    addToast('Solicitud guardada');
    setCurrentPage('confirm-request');
  };

  // Se ejecuta al confirmar el formulario de actualización de PDV.
  // Actualmente se guarda en localStorage y muestra confirmación.
  // Con backend, aquí se enviaría la información actualizada.
  const handleUpdateConfirm = (updatedData) => {
    // console.log('Datos del PDV Actualizados:', updatedData);
    setConfirmationMessage('¡Los datos del PDV han sido actualizados correctamente!');
    addToast('Datos del PDV guardados');
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

  // Al iniciar sesión correctamente mostramos la página principal
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  // Cerrar sesión y volver al login
  const handleLogout = () => {
    handleGoHome();
    setIsLoggedIn(false);
    setCurrentPage('login');
  };

  // Devuelve el título que debe mostrar el encabezado según la vista actual
  const getHeaderTitle = () => {
    switch (currentPage) {
      case 'login':
        return 'Inicio de Sesión';
      case 'home':
        return 'Base de Destinatarios';
      case 'trade-nacional':
      case 'trade-regional':
        return `Gestión ${selectedTradeType === 'nacional' ? 'Nacional' : 'Regional'}`;
      case 'channel-select':
        return 'Selección de Canal';
      case 'channel-menu':
        return `Canal ${channelList.find((c) => c.id === selectedChannelId)?.name || selectedChannelId}`;
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
      case 'export-data':
        return 'Exportar Datos';
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
      case 'channel-menu':
        setCurrentPage('channel-select');
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
        setCurrentPage('channel-menu');
        break;
      case 'campaigns-menu':
        setCurrentPage('pdv-actions');
        break;
      case 'create-campaign':
      case 'manage-campaigns':
        setCurrentPage('campaigns-menu');
        break;
      case 'export-data':
        setCurrentPage('pdv-actions');
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
      <LayoutHeader
        title={getHeaderTitle()}
        onLogoClick={isLoggedIn ? handleGoHome : null}
        onBack={isLoggedIn && currentPage !== 'home' ? handleBack : null}
        onLogout={isLoggedIn ? handleLogout : null}
      />

      <div className="flex flex-grow">
        {isLoggedIn && currentPage !== 'login' && (
          <Sidebar
            onHome={handleGoHome}
            onChannels={() => setCurrentPage('channel-select')}
            onCampaigns={() => setCurrentPage('campaigns-menu')}
            onExport={handleExportData}
            onLogout={handleLogout}
            showManagement={selectedTradeType === 'nacional'}
          />
        )}

        <main className="flex-grow p-4 flex items-center justify-center">
        {!isLoggedIn && (
          <LoginScreen onLogin={handleLogin} />
        )}

        {/* Vista de inicio con selección de tipo de trade */}
        {isLoggedIn && currentPage === 'home' && (
          <HomeMenu onSelectTrade={handleSelectTrade} />
        )}

        {/* Listado de canales disponibles */}
        {isLoggedIn && currentPage === 'channel-select' && (
          <ChannelSelector
            onSelectChannel={handleSelectChannel}
            onCreateCampaign={
              selectedTradeType === 'nacional' ? handleCreateCampaign : undefined
            }
            onExportData={
              selectedTradeType === 'nacional' ? handleExportData : undefined
            }
          />
        )}

        {/* Menú del canal seleccionado */}
        {isLoggedIn && currentPage === 'channel-menu' && (
          <ChannelMenu
            channelId={selectedChannelId}
            onSelectPdv={handleManageChannel}
            onViewRequests={() => handleViewChannelRequests(selectedChannelId)}
          />
        )}

        {/* Selección de región, subterritorio y PDV */}
        {isLoggedIn && currentPage === 'location-select' && (
          <LocationSelector
            onSelectPdv={handleSelectPdv}
            selectedChannel={selectedChannelId}
          />
        )}

        {/* Acciones disponibles para el PDV */}
        {isLoggedIn && currentPage === 'pdv-actions' && (
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
            </div>
          </div>
        )}

        {/* Formulario para solicitar material */}
        {isLoggedIn && currentPage === 'request-material' && (
        <MaterialRequestForm
          onConfirmRequest={handleConfirmRequest}
          onBackToPdv={() => setCurrentPage('pdv-actions')}
          selectedPdvId={selectedPdvId}
          selectedPdvName={selectedPdvName}
          selectedRegionId={selectedRegionId}
          selectedRegionName={selectedRegionName}
          selectedSubId={selectedSubId}
          selectedSubName={selectedSubName}
          selectedChannelId={selectedChannelId}
          tradeType={selectedTradeType}
          addToast={addToast}
        />
        )}

        {/* Formulario para actualizar información del PDV */}
        {isLoggedIn && currentPage === 'update-pdv' && (
          <PdvUpdateForm
            selectedPdvId={selectedPdvId}
            onUpdateConfirm={handleUpdateConfirm}
            channelId={selectedChannelId}
          />
        )}

        {/* Historial de solicitudes para el PDV */}
        {isLoggedIn && currentPage === 'previous-requests' && (
          <PreviousRequests pdvId={selectedPdvId} onBack={handleBack} />
        )}

        {/* Historial de solicitudes por canal */}
        {isLoggedIn && currentPage === 'channel-requests' && (
          <ChannelRequests channelId={selectedChannelId} onBack={handleBack} />
        )}

        {/* Menú de campañas */}
        {isLoggedIn && currentPage === 'campaigns-menu' && (
          <CampaignsMenu onCreate={() => setCurrentPage('create-campaign')} onManage={() => setCurrentPage('manage-campaigns')} />
        )}

        {/* Crear campaña */}
        {isLoggedIn && currentPage === 'create-campaign' && (
          <CreateCampaignForm onBack={() => setCurrentPage('channel-select')} />
        )}

        {/* Gestionar campañas */}
        {isLoggedIn && currentPage === 'manage-campaigns' && (
          <ManageCampaigns onBack={handleBack} />
        )}

        {/* Exportar datos */}
        {isLoggedIn && currentPage === 'export-data' && (
          <ExportData onBack={handleBack} onExport={performExport} />
        )}

        {/* Mensaje de confirmación de acciones */}
        {isLoggedIn && (currentPage === 'confirm-request' || currentPage === 'confirm-update') && (
          <ConfirmationMessage
            message={confirmationMessage}
            onGoHome={handleGoHome}
            onStayInChannel={() => setCurrentPage('location-select')}
            onBackToPdv={() => setCurrentPage('pdv-actions')}
            pdvName={selectedPdvName}
          />
        )}
        </main>
      </div>
      <LayoutFooter />
    </div>
  );
};

export default App;
