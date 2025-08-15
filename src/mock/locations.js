import normalizeLocationData, { validateNewPdv } from '../utils/locationNormalizer';

// Raw region list intentionally missing some entries to test normalization
const rawRegions = [
  { id: 'region-bogota', name: 'Bogotá' },
  { id: 'region-sur', name: 'región sur' },
  { id: 'region-costa', name: 'REGIÓN COSTA' },
  { id: 'region-andina', name: 'andina' },
];

// Mapping of region -> subterritories
const rawSubterritories = {
  'region-bogota': [
    { id: 'sub-bogota-1', name: 'Bogotá Zona 1' },
    { id: 'sub-bogota-2', name: 'Bogotá Zona 2' },
  ],
  'region-sur': [
    { id: 'sub-sur-1', name: 'Subterritorio Sur 1' },
    { id: 'sub-sur-2', name: 'Subterritorio Sur 2' },
  ],
  // Región Centro no estaba listada en rawRegions
  'region-centro': [
    { id: 'sub-centro-1', name: 'Subterritorio Centro 1' },
    { id: 'sub-centro-2', name: 'Subterritorio Centro 2' },
  ],
  'region-andina': [
    { id: 'sub-andina-santanderes', name: 'Santanderes' },
    { id: 'sub-andina-sur', name: 'Sur' },
    { id: 'sub-andina-norte', name: 'Norte' },
  ],
};

// PDVs grouped by subterritory. Many IDs are duplicated intentionally to test
// the normalization process which assigns unique IDs.
const rawPdvs = {
  'sub-bogota-1': [
    { id: 'pdv-b1-001', name: 'PDV Bogotá 1 - 001' },
    { id: 'pdv-b1-002', name: 'PDV Bogotá 1 - 002' },
  ],
  'sub-bogota-2': [
    { id: 'pdv-b2-001', name: 'PDV Bogotá 2 - 001' },
    { id: 'pdv-b2-002', name: 'PDV Bogotá 2 - 002' },
  ],
  'sub-sur-1': [
    { id: 'pdv-s1-001', name: 'PDV Sur 1 - 001' },
    { id: 'pdv-s1-002', name: 'PDV Sur 1 - 002' },
  ],
  'sub-sur-2': [
    { id: 'pdv-s2-001', name: 'PDV Sur 2 - 001' },
    { id: 'pdv-s2-002', name: 'PDV Sur 2 - 002' },
  ],
  'sub-centro-1': [
    { id: 'pdv-c1-001', name: 'PDV Centro 1 - 001' },
    { id: 'pdv-c1-002', name: 'PDV Centro 1 - 002' },
  ],
  'sub-centro-2': [
    { id: 'pdv-c2-001', name: 'PDV Centro 2 - 001' },
    { id: 'pdv-c2-002', name: 'PDV Centro 2 - 002' },
  ],
  'sub-andina-santanderes': [
    { id: 'pdv-1', name: 'BUCARAMANGA PAP 1' },
    { id: 'pdv-2', name: 'BUCARAMANGA PAP 2' },
    { id: 'pdv-3', name: 'BUCARAMANGA PAP 3' },
    { id: 'pdv-4', name: 'BARRANCA PAP 1' },
    { id: 'pdv-5', name: 'CUCUTA PAP 1' },
    { id: 'pdv-6', name: 'BARRANCA PAP 2' },
    { id: 'pdv-7', name: 'CUCUTA PAP 2' },
    { id: 'pdv-8', name: 'BUCARAMANGA PAP 8' },
    { id: 'pdv-9', name: 'BUCARAMANGA PAP 9' },
    { id: 'pdv-10', name: 'BUCARAMANGA PAP 10' },
    { id: 'pdv-11', name: 'BUCARAMANGA PAP 4' },
    { id: 'pdv-12', name: 'BUCARAMANGA PAP 5' },
    { id: 'pdv-13', name: 'BUCARAMANGA PAP 6' },
    { id: 'pdv-14', name: 'BUCARAMANGA PAP 7' },
    { id: 'pdv-15', name: 'BARRANCA PAP 1' },
    { id: 'pdv-16', name: 'CUCUTA PAP 3' },
    { id: 'pdv-17', name: 'CUCUTA PAP 4' },
    { id: 'pdv-18', name: 'CUCUTA PAP 5' },
    { id: 'pdv-19', name: 'SOGAMOSO PAP 1' },
    { id: 'pdv-20', name: 'PAP TUNJA' },
  ],
  'sub-andina-sur': [
    { id: 'pdv-1', name: 'PAP APARTADO 1' },
    { id: 'pdv-2', name: 'PAP APARTADO 2' },
    { id: 'pdv-3', name: 'TELEFONOS PUBLICOS' },
    { id: 'pdv-4', name: 'MEDELLIN PAP 13' },
    { id: 'pdv-5', name: 'S&M' },
    { id: 'pdv-6', name: 'MEDELLIN PAP 11' },
    { id: 'pdv-7', name: 'MEDELLIN PAP 10' },
    { id: 'pdv-8', name: 'MEDELLIN PAP 1' },
    { id: 'pdv-9', name: 'MEDELLIN PAP 6' },
    { id: 'pdv-10', name: 'MEDELLIN PAP 8' },
    { id: 'pdv-11', name: 'MEDELLIN PAP 20' },
    { id: 'pdv-12', name: 'MEDELLIN PAP 24' },
  ],
  'sub-andina-norte': [
    { id: 'pdv-1', name: 'FVD CAUCASIA' },
    { id: 'pdv-2', name: 'MEDELLIN PAP 2' },
    { id: 'pdv-3', name: 'MEDELLIN PAP 14' },
    { id: 'pdv-4', name: 'MEDELLIN PAP 15' },
    { id: 'pdv-5', name: 'MEDELLIN PAP 9' },
    { id: 'pdv-6', name: 'MEDELLIN PAP 12' },
    { id: 'pdv-7', name: 'MEDELLIN PAP 3' },
    { id: 'pdv-8', name: 'MEDELLIN PAP 4' },
    { id: 'pdv-9', name: 'ORIENTE PAP EFICACIA 1' },
    { id: 'pdv-10', name: 'ORIENTE PAP EFICACIA 2' },
    { id: 'pdv-11', name: 'ORIENTE PAP EFICACIA 4' },
  ],
};

// Perform normalization to clean and enrich the data structures
const { regions, subterritories, pdvs, warnings } = normalizeLocationData(
  rawRegions,
  rawSubterritories,
  rawPdvs,
);

if (warnings.length > 0) {
  if (process.env.NODE_ENV === 'development') {
    try {
      localStorage.setItem('normalization_report', JSON.stringify(warnings));
    } catch (err) {
      // ignore storage errors
    }
  }
  console.groupCollapsed('[Normalization] Inconsistencias en dataset embebido');
  console.warn(`${warnings.length} inconsistencias detectadas`);
  console.table(warnings.map((w, i) => ({ '#': i + 1, mensaje: w })));
  console.groupEnd();
}

export { regions, subterritories, pdvs, validateNewPdv };
