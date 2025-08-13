import React, { useState, useMemo } from 'react';
import { formatQuantity } from '../../utils/materialDisplay';

const HistoryList = ({
  scope = 'pdv',
  title = 'Historial',
  requests = [],
  updates = [],
  onBack,
  context = {},
}) => {
  const [typeFilter, setTypeFilter] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [search, setSearch] = useState('');
  const [showReqSection, setShowReqSection] = useState(false);
  const [showUpdSection, setShowUpdSection] = useState(false);
  const [expandedReqs, setExpandedReqs] = useState({});
  const [expandedUpds, setExpandedUpds] = useState({});

  const matchesSearch = (text = '') =>
    text.toLowerCase().includes(search.toLowerCase());

  const filterList = (list, kind) => {
    return list.filter((entry) => {
      if (fromDate && new Date(entry.date) < new Date(fromDate)) return false;
      if (toDate && new Date(entry.date) > new Date(toDate)) return false;
      if (search) {
        if (kind === 'request') {
          const inPdv = matchesSearch(entry.pdvName || entry.pdvId);
          const inCampaign = entry.campaign && matchesSearch(entry.campaign);
          const inNotes = entry.pdvSnapshot && matchesSearch(entry.pdvSnapshot.notes || '');
          const inItems = entry.items.some(
            (it) => matchesSearch(it.displayName) || matchesSearch(it.rawName),
          );
          if (!(inPdv || inCampaign || inNotes || inItems)) return false;
        } else {
          const inPdv = matchesSearch(entry.pdvName || entry.pdvId);
          const inNotes = matchesSearch(entry.data.notes || '');
          if (!(inPdv || inNotes)) return false;
        }
      }
      return true;
    });
  };

  const filteredRequests = useMemo(() => {
    if (typeFilter === 'updates') return [];
    return filterList(requests, 'request');
  }, [requests, typeFilter, fromDate, toDate, search]);

  const filteredUpdates = useMemo(() => {
    if (typeFilter === 'material') return [];
    return filterList(updates, 'update');
  }, [updates, typeFilter, fromDate, toDate, search]);

  const toggleReqCard = (id) =>
    setExpandedReqs((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleUpdCard = (id) =>
    setExpandedUpds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="relative p-6 bg-white rounded-xl shadow-lg max-w-md mx-auto mt-8 pb-24">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">{title}</h2>
      {context && (
        <p className="text-center text-sm text-gray-600 mb-4">
          {scope === 'pdv'
            ? `${context.pdvName || context.pdvId || ''} - ${context.subterritory || ''} - ${context.region || ''}`
            : context.canal || ''}
        </p>
      )}

      {/* Filters */}
      <div className="mb-4 space-y-2">
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded p-2 flex-1"
          >
            <option value="all">Todos</option>
            <option value="material">Solo Material</option>
            <option value="updates">Solo Actualizaciones</option>
          </select>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
        </div>
        <input
          type="text"
          placeholder="Buscar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
      </div>

      {/* Material Requests Section */}
      {typeFilter !== 'updates' && (
        <div className="mb-4">
          <button
            onClick={() => setShowReqSection((p) => !p)}
            className="w-full flex justify-between items-center bg-gray-100 rounded-lg p-3"
          >
            <span className="font-semibold text-gray-800">Solicitudes de Material</span>
            <span className="text-xl">{showReqSection ? '−' : '+'}</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showReqSection ? 'max-h-[1000px] mt-3' : 'max-h-0'
            }`}
          >
            {filteredRequests.length === 0 ? (
              <p className="text-gray-600 text-center mt-4">No hay datos para mostrar.</p>
            ) : (
              <ul className="space-y-4 mt-4">
                {filteredRequests.map((req) => {
                  const expanded = expandedReqs[req.id];
                  const items = expanded ? req.items : req.items.slice(0, 3);
                  return (
                    <li key={req.id} className="bg-gray-50 p-4 rounded-lg shadow">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {new Date(req.date).toLocaleDateString()} {scope === 'canal' && `• ${req.pdvName || req.pdvId}`}
                          </p>
                          {req.campaign && (
                            <p className="text-xs text-gray-600">{req.campaign}</p>
                          )}
                        </div>
                        <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">
                          {req.items.length}
                        </span>
                      </div>
                      <ul className="ml-6 list-disc">
                        {items.map((item) => (
                          <li key={item.id}>
                            {item.displayName} - {item.measure} ({
                              formatQuantity(item.rawName, item.quantity)
                            })
                          </li>
                        ))}
                      </ul>
                      {req.items.length > 3 && (
                        <button
                          onClick={() => toggleReqCard(req.id)}
                          className="text-sm text-tigo-blue mt-2"
                        >
                          {expanded ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* PDV Updates Section */}
      {typeFilter !== 'material' && (
        <div className="mb-4">
          <button
            onClick={() => setShowUpdSection((p) => !p)}
            className="w-full flex justify-between items-center bg-gray-100 rounded-lg p-3"
          >
            <span className="font-semibold text-gray-800">Actualizaciones de PDV</span>
            <span className="text-xl">{showUpdSection ? '−' : '+'}</span>
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              showUpdSection ? 'max-h-[1000px] mt-3' : 'max-h-0'
            }`}
          >
            {filteredUpdates.length === 0 ? (
              <p className="text-gray-600 text-center mt-4">No hay datos para mostrar.</p>
            ) : (
              <ul className="space-y-4 mt-4">
                {filteredUpdates.map((up) => {
                  const fields = [
                    { label: 'Contacto', value: up.data.contactName },
                    { label: 'Teléfono', value: up.data.contactPhone },
                    { label: 'Ciudad', value: up.data.city },
                    { label: 'Dirección', value: up.data.address },
                    { label: 'Notas', value: up.data.notes },
                  ].filter((f) => f.value);
                  const expanded = expandedUpds[up.id];
                  const items = expanded ? fields : fields.slice(0, 3);
                  return (
                    <li key={up.id} className="bg-gray-50 p-4 rounded-lg shadow">
                      <div className="mb-2">
                        <p className="font-semibold text-gray-800 text-sm">
                          {new Date(up.date).toLocaleDateString()} {scope === 'canal' && `• ${up.pdvName || up.pdvId}`}
                        </p>
                      </div>
                      <ul className="ml-6 list-disc">
                        {items.map((f, idx) => (
                          <li key={idx}>
                            {f.label}: {f.value}
                          </li>
                        ))}
                      </ul>
                      {fields.length > 3 && (
                        <button
                          onClick={() => toggleUpdCard(up.id)}
                          className="text-sm text-tigo-blue mt-2"
                        >
                          {expanded ? 'Ver menos' : 'Ver más'}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      <button
        onClick={onBack}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 w-11/12 max-w-md bg-tigo-blue text-white py-3 px-4 rounded-lg shadow-md hover:bg-[#00447e] transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        Volver
      </button>
    </div>
  );
};

export default HistoryList;

