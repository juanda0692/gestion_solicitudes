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
  tradeType,
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
  const tradeLabel = tradeType === 'nacional' ? 'Trade Nacional' : tradeType === 'regional' ? 'Trade Regional' : '';

  const IconWrap = ({ active, children }) => (
    <span
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors ${
        active ? 'bg-white/70 text-tigo-blue' : 'bg-slate-100 text-slate-600'
      }`}
      aria-hidden
    >
      {children}
    </span>
  );

  const Item = ({ id, label, onClick, children }) => {
    const active = activeSection === id;
    return (
      <button
        type="button"
        onClick={onClick}
        title={!open ? label : undefined}
        aria-current={active ? 'page' : undefined}
        aria-label={label}
        className={`relative flex items-center ${open ? 'justify-start gap-2' : 'justify-center'} w-full py-2.5 px-2.5 rounded-lg transition-colors ${
          active
            ? 'bg-tigo-blue/15 text-tigo-blue font-semibold'
            : 'text-slate-700 hover:bg-tigo-blue/10'
        }`}
      >
        {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r bg-tigo-blue" aria-hidden />}
        <IconWrap active={active}>{children}</IconWrap>
        {open && <span className="text-sm">{label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`bg-white border-r border-slate-200 shadow-md min-h-full flex flex-col ${open ? 'w-52' : 'w-[72px]'} transition-all duration-300`}
      aria-label="Navegacion principal"
    >
      <div className="px-2 pt-2 pb-2 border-b border-slate-100">
        <div className={`flex ${open ? 'justify-between' : 'justify-center'} items-center gap-2`}>
          {open && (
            <div className="px-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">Navegacion</p>
              {tradeLabel && <p className="text-xs text-slate-600 mt-0.5">{tradeLabel}</p>}
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Contraer menu lateral' : 'Expandir menu lateral'}
            className="ui-icon-btn p-1.5 text-slate-700"
          >
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-2">
        <Item id="home" onClick={onHome} label="Inicio">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.9" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
        </Item>

        <Item id="channels" onClick={onChannels} label="Canales">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.9" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </Item>

        {showManagement && (
          <>
            <Item id="export" onClick={onExport} label="Exportar">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.9" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v10m0 0l-3-3m3 3l3-3M5 18h14v2H5v-2z" />
              </svg>
            </Item>
            {/* <Item id="campaigns" onClick={onCampaigns} label="Campanas">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.9" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
              </svg>
            </Item> */}
          </>
        )}
      </nav>

      <div className="mt-auto p-2 border-t border-slate-100">
        <Item id="logout" onClick={onLogout} label="Salir">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.9" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l-5-5 5-5M5 12h10M14 5h5v14h-5" />
          </svg>
        </Item>
      </div>
    </aside>
  );
};

export default Sidebar;
