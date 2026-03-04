import React from 'react';

/** Pie de pagina simple con copyright */
const LayoutFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/80 backdrop-blur border-t border-slate-200 text-slate-500 text-center py-3 mt-auto">
      <p className="text-sm">&copy; {currentYear} Tigo. Todos los derechos reservados.</p>
    </footer>
  );
};

export default LayoutFooter;
