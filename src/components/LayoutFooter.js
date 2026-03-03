import React from 'react';

/** Pie de página simple con copyright */

const LayoutFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-500 text-center py-4 mt-auto">
      <p className="text-sm">&copy; {currentYear} Tigo. Todos los derechos reservados.</p>
    </footer>
  );
};

export default LayoutFooter;

