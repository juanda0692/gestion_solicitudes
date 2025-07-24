export const channelMaterials = {
  tiendas: [
    { id: 'material-101', stock: 120 },
    { id: 'material-103', stock: 80 },
  ],
  'tigo-express': [
    { id: 'material-101', stock: 60 },
    { id: 'material-102', stock: 100 },
  ],
  islas: [
    { id: 'material-102', stock: 50 },
  ],
  'fvd-home': [
    { id: 'material-103', stock: 70 },
  ],
  'dealer-home': [
    { id: 'material-104', stock: 30 },
  ],
};

// Ejemplo de filas provenientes de Excel
export const channelMaterialImportExample = [
  { materialId: 'material-101', channel: 'tiendas', stock: 120 },
  { materialId: 'material-103', channel: 'tiendas', stock: 80 },
  { materialId: 'material-101', channel: 'tigo-express', stock: 60 },
  { materialId: 'material-102', channel: 'tigo-express', stock: 100 },
];
