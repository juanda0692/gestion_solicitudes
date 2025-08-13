import React from 'react';

const variantStyles = {
  empty: 'text-gray-600',
  loading: 'text-gray-600',
  error: 'text-red-600',
};

const StateBlock = ({ variant = 'empty', title, description, actionLabel, onAction }) => {
  return (
    <div className={`text-center py-8 ${variantStyles[variant] || ''}`}>
      {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
      {description && <p className="text-sm mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-tigo-blue text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-tigo-blue"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default StateBlock;
