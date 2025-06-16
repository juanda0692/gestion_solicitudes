import React, { useState } from 'react';
import LayoutHeader from './components/LayoutHeader';
import ChannelSelector from './components/ChannelSelector';
import LocationSelector from './components/LocationSelector';
import MaterialRequestForm from './components/MaterialRequestForm';
import PdvUpdateForm from './components/PdvUpdateForm';
import ConfirmationMessage from './components/ConfirmationMessage';
import PreviousRequests from './components/PreviousRequests';
import { getStorageItem, setStorageItem } from './utils/storage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'trade-nacional', 'trade-regional', 'channel-select', 'location-select', 'pdv-actions', 'request-material', 'update-pdv', 'previous-requests', 'confirm-request', 'confirm-update'
  const [selectedTradeType, setSelectedTradeType] = useState(''); // 'nacional' o 'regional'
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [selectedPdvId, setSelectedPdvId] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const handleSelectTrade = (type) => {
    setSelectedTradeType(type);
    setCurrentPage('channel-select');
  };

  const handleSelectChannel = (channelId) => {
    setSelectedChannelId(channelId);
    setCurrentPage('location-select');
  };

  const handleSelectPdv = (pdvId) => {
    setSelectedPdvId(pdvId);
    setCurrentPage('pdv-actions');
  };

  const handleRequestMaterial = () => {
    setCurrentPage('request-material');
  };

  const handleUpdatePdv = () => {
    setCurrentPage('update-pdv');
  };

  const handleViewRequests = () => {
    setCurrentPage('previous-requests');
  };

  const handleConfirmRequest = (requestDetails) => {
    console.log('Solicitud de Material Confirmada:', requestDetails);
    const existing = getStorageItem('material-requests') || [];
    setStorageItem('material-requests', [...existing, requestDetails]);
    setConfirmationMessage('¡Tu solicitud de material ha sido enviada con éxito!');
    setCurrentPage('confirm-request');
  };

  const handleUpdateConfirm = (updatedData) => {
    console.log('Datos del PDV Actualizados:', updatedData);
    setConfirmationMessage('¡Los datos del PDV han sido actualizados correctamente!');
    setCurrentPage('confirm-update');
  };

  const handleGoHome = () => {
    setCurrentPage('home');
    setSelectedTradeType('');
    setSelectedChannelId('');
    setSelectedPdvId('');
    setConfirmationMessage('');
  };

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
        return `Acciones para ${selectedPdvId}`;
      case 'request-material':
        return 'Solicitar Material';
      case 'update-pdv':
        return 'Actualizar PDV';
      case 'previous-requests':
        return 'Solicitudes Anteriores';
      case 'confirm-request':
      case 'confirm-update':
        return 'Confirmación';
      default:
        return 'Base de Destinatarios';
    }
  };

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
      case 'confirm-request':
      case 'confirm-update':
        setCurrentPage('home');
        break;
      default:
        setCurrentPage('home');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <LayoutHeader title={getHeaderTitle()} onBack={currentPage !== 'home' ? handleBack : null} />

      <main className="flex-grow p-4 flex items-center justify-center">
        {currentPage === 'home' && (
          <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido</h2>
            <div className="space-y-4">
              <button
                onClick={() => handleSelectTrade('nacional')}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                TRADE NACIONAL
              </button>
              <button
                onClick={() => handleSelectTrade('regional')}
                className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-purple-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                TRADE REGIONAL
              </button>
            </div>
          </div>
        )}

        {currentPage === 'channel-select' && (
          <ChannelSelector onSelectChannel={handleSelectChannel} />
        )}

        {currentPage === 'location-select' && (
          <LocationSelector onSelectPdv={handleSelectPdv} selectedChannel={selectedChannelId} />
        )}

        {currentPage === 'pdv-actions' && (
          <div className="p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acciones para {selectedPdvId}</h2>
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
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Ver Solicitudes Anteriores
              </button>
            </div>
          </div>
        )}

        {currentPage === 'request-material' && (
          <MaterialRequestForm onConfirmRequest={handleConfirmRequest} selectedPdvId={selectedPdvId} />
        )}

        {currentPage === 'update-pdv' && (
          <PdvUpdateForm selectedPdvId={selectedPdvId} onUpdateConfirm={handleUpdateConfirm} />
        )}

        {currentPage === 'previous-requests' && (
          <PreviousRequests pdvId={selectedPdvId} onBack={handleBack} />
        )}

        {(currentPage === 'confirm-request' || currentPage === 'confirm-update') && (
          <ConfirmationMessage message={confirmationMessage} onGoHome={handleGoHome} />
        )}
      </main>
    </div>
  );
};

export default App;
