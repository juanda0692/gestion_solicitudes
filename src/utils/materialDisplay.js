export const getDisplayName = (name = '') => {
  const trimmed = name.trim();
  const lower = trimmed.toLowerCase();
  if (lower.includes('tend card') || lower.includes('nps')) {
    return `Puesto de asesores (${trimmed})`;
  }
  return trimmed;
};

export const formatQuantity = (name = '', quantity) => {
  if (name.toLowerCase().includes('volantes')) {
    return `${quantity} asesores`;
  }
  return quantity;
};
