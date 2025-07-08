import React from 'react';

/**
 * Logo de Tigo representado como SVG para usarlo como componente React.
 * Se acepta una clase opcional para controlar el tamano desde Tailwind.
 */
const TigoLogo = ({ className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 40"
    fill="none"
    className={className}
  >
    <rect width="120" height="40" rx="6" fill="#0056A0" />
    <text
      x="50%"
      y="50%"
      fill="white"
      fontFamily="Arial, sans-serif"
      fontSize="20"
      dominantBaseline="middle"
      textAnchor="middle"
    >
      Tigo
    </text>
  </svg>
);

export default TigoLogo;
