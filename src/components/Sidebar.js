import React, { useState } from 'react';

/**
 * Barra lateral de navegación.
 * Permite acceder rápidamente a las secciones principales de la app.
 */
const Sidebar = ({
  onHome,
  onChannels,
  onCampaigns,
  onExport,
  onLogout,
  showManagement,
}) => {
  const [open, setOpen] = useState(true);

  const Item = ({ label, onClick, children }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 w-full py-2 px-3 text-gray-700 hover:bg-tigo-blue/10"
    >
      {children}
      {open && <span className="text-sm">{label}</span>}
    </button>
  );

  return (
    <aside
      className={`bg-white shadow-md h-full flex flex-col ${open ? 'w-48' : 'w-14'} transition-all duration-300`}
    >
      <div className="p-2 flex justify-end">
        <button onClick={() => setOpen(!open)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col space-y-1">
        <Item onClick={onHome} label="Inicio">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9.75L12 4l9 5.75v9.25a1 1 0 01-1 1h-4a1 1 0 01-1-1v-5H9v5a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
          </svg>
        </Item>
        <Item onClick={onChannels} label="Canales">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Item>
        {showManagement && (
          <>
            <Item onClick={onExport} label="Exportar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-3-3m3 3l3-3m-9 3v4h12v-4" />
              </svg>
            </Item>
            <Item onClick={onCampaigns} label="Campañas">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M3 6h18M3 12h18M3 18h18" />
              </svg>
            </Item>
          </>
        )}
        <Item onClick={onLogout} label="Salir">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H3m0 0l3.75-3.75M3 12l3.75 3.75M21 4v16" />
          </svg>
        </Item>
      </nav>
    </aside>
  );
};

export default Sidebar;
