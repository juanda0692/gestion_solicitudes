import React, { useState } from 'react';

/**
 * Barra lateral de navegacion.
 * Permite acceder rapidamente a las secciones principales de la app.
 */
const Sidebar = ({
  onHome,
  onChannels,
  onCampaigns,
  onExport,
  onLogout,
  showManagement,
  currentPage,
}) => {
  const [open, setOpen] = useState(true);

  const sectionByPage = {
    home: 'home',
    'channel-select': 'channels',
    'channel-menu': 'channels',
    'location-select': 'channels',
    'pdv-actions': 'channels',
    'request-material': 'channels',
    'update-pdv': 'channels',
    'previous-requests': 'channels',
    'channel-requests': 'channels',
    'confirm-request': 'channels',
    'confirm-update': 'channels',
    'campaigns-menu': 'campaigns',
    'create-campaign': 'campaigns',
    'manage-campaigns': 'campaigns',
    'export-data': 'export',
  };

  const activeSection = sectionByPage[currentPage] || 'home';

  const Item = ({ id, label, onClick, children }) => {
    const active = activeSection === id;
    return (
      <button
        type="button"
        onClick={onClick}
        title={!open ? label : undefined}
        aria-current={active ? 'page' : undefined}
        className={`flex items-center gap-2 w-full py-2.5 px-3 rounded-lg transition-colors ${
          active
            ? 'bg-tigo-blue/15 text-tigo-blue font-semibold'
            : 'text-gray-700 hover:bg-tigo-blue/10'
        }`}
      >
        {children}
        {open && <span className="text-sm">{label}</span>}
      </button>
    );
  };

  return (
    <aside className={`bg-white border-r border-slate-200 shadow-md min-h-full flex flex-col ${open ? 'w-48' : 'w-16'} transition-all duration-300`}>
      <div className="p-2 flex justify-end border-b border-slate-100">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Contraer menu lateral' : 'Expandir menu lateral'}
          className="ui-icon-btn p-1.5 text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col gap-1 p-2">
        <Item id="home" onClick={onHome} label="Inicio">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75v9.25a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5H9v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
          </svg>
        </Item>
        <Item id="channels" onClick={onChannels} label="Canales">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Item>
        {showManagement && (
          <>
            <Item id="export" onClick={onExport} label="Exportar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3-3m3 3l3-3m-9 3v4h12v-4" />
              </svg>
            </Item>
            {/* <Item id="campaigns" onClick={onCampaigns} label="Campanas">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M3 6h18M3 12h18M3 18h18" />
              </svg>
            </Item> */}
          </>
        )}
        <Item id="logout" onClick={onLogout} label="Salir">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l3.75-3.75M3 12l3.75 3.75M21 4v16" />
          </svg>
        </Item>
      </nav>
    </aside>
  );
};

export default Sidebar;
