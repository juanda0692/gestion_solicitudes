import { validateNewPdv } from '../utils/locationNormalizer';

export const regions = [
  {
    "id": "region-bogota",
    "name": "Bogotá"
  },
  {
    "id": "region-sur",
    "name": "RegióN Sur"
  },
  {
    "id": "region-costa",
    "name": "RegióN Costa"
  },
  {
    "id": "region-andina",
    "name": "Andina"
  },
  {
    "id": "region-centro",
    "name": "Centro"
  }
];
export const subterritories = {
  "region-bogota": [
    {
      "id": "sub-bogota-1",
      "name": "Bogotá Zona 1"
    },
    {
      "id": "sub-bogota-2",
      "name": "Bogotá Zona 2"
    }
  ],
  "region-sur": [
    {
      "id": "sub-sur-1",
      "name": "Subterritorio Sur 1"
    },
    {
      "id": "sub-sur-2",
      "name": "Subterritorio Sur 2"
    }
  ],
  "region-centro": [
    {
      "id": "sub-centro-1",
      "name": "Subterritorio Centro 1"
    },
    {
      "id": "sub-centro-2",
      "name": "Subterritorio Centro 2"
    }
  ],
  "region-andina": [
    {
      "id": "sub-andina-santanderes",
      "name": "Santanderes"
    },
    {
      "id": "sub-andina-sur",
      "name": "Sur"
    },
    {
      "id": "sub-andina-norte",
      "name": "Norte"
    }
  ]
};
export const pdvs = {
  "sub-bogota-1": [
    {
      "id": "pdv-b1-001",
      "name": "Pdv Bogotá 1 - 001",
      "regionId": "region-bogota",
      "subterritoryId": "sub-bogota-1",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-b1-002",
      "name": "Pdv Bogotá 1 - 002",
      "regionId": "region-bogota",
      "subterritoryId": "sub-bogota-1",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-bogota-2": [
    {
      "id": "pdv-b2-001",
      "name": "Pdv Bogotá 2 - 001",
      "regionId": "region-bogota",
      "subterritoryId": "sub-bogota-2",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-b2-002",
      "name": "Pdv Bogotá 2 - 002",
      "regionId": "region-bogota",
      "subterritoryId": "sub-bogota-2",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-sur-1": [
    {
      "id": "pdv-s1-001",
      "name": "Pdv Sur 1 - 001",
      "regionId": "region-sur",
      "subterritoryId": "sub-sur-1",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-s1-002",
      "name": "Pdv Sur 1 - 002",
      "regionId": "region-sur",
      "subterritoryId": "sub-sur-1",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-sur-2": [
    {
      "id": "pdv-s2-001",
      "name": "Pdv Sur 2 - 001",
      "regionId": "region-sur",
      "subterritoryId": "sub-sur-2",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-s2-002",
      "name": "Pdv Sur 2 - 002",
      "regionId": "region-sur",
      "subterritoryId": "sub-sur-2",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-centro-1": [
    {
      "id": "pdv-c1-001",
      "name": "Pdv Centro 1 - 001",
      "regionId": "region-centro",
      "subterritoryId": "sub-centro-1",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-c1-002",
      "name": "Pdv Centro 1 - 002",
      "regionId": "region-centro",
      "subterritoryId": "sub-centro-1",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-centro-2": [
    {
      "id": "pdv-c2-001",
      "name": "Pdv Centro 2 - 001",
      "regionId": "region-centro",
      "subterritoryId": "sub-centro-2",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-c2-002",
      "name": "Pdv Centro 2 - 002",
      "regionId": "region-centro",
      "subterritoryId": "sub-centro-2",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-andina-santanderes": [
    {
      "id": "pdv-1",
      "name": "Bucaramanga Pap 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-2",
      "name": "Bucaramanga Pap 2",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-3",
      "name": "Bucaramanga Pap 3",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-4",
      "name": "Barranca Pap 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-5",
      "name": "Cucuta Pap 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-6",
      "name": "Barranca Pap 2",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-7",
      "name": "Cucuta Pap 2",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-8",
      "name": "Bucaramanga Pap 8",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-9",
      "name": "Bucaramanga Pap 9",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-10",
      "name": "Bucaramanga Pap 10",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-11",
      "name": "Bucaramanga Pap 4",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-12",
      "name": "Bucaramanga Pap 5",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-13",
      "name": "Bucaramanga Pap 6",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-14",
      "name": "Bucaramanga Pap 7",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-15",
      "name": "Barranca Pap 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-16",
      "name": "Cucuta Pap 3",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-17",
      "name": "Cucuta Pap 4",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-18",
      "name": "Cucuta Pap 5",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-19",
      "name": "Sogamoso Pap 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-20",
      "name": "Pap Tunja",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-santanderes",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-andina-sur": [
    {
      "id": "pdv-1-2",
      "name": "Pap Apartado 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-2-2",
      "name": "Pap Apartado 2",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-3-2",
      "name": "Telefonos Publicos",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-4-2",
      "name": "Medellin Pap 13",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-5-2",
      "name": "S&M",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-6-2",
      "name": "Medellin Pap 11",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-7-2",
      "name": "Medellin Pap 10",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-8-2",
      "name": "Medellin Pap 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-9-2",
      "name": "Medellin Pap 6",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-10-2",
      "name": "Medellin Pap 8",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-11-2",
      "name": "Medellin Pap 20",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-12-2",
      "name": "Medellin Pap 24",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-sur",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ],
  "sub-andina-norte": [
    {
      "id": "pdv-1-3",
      "name": "Fvd Caucasia",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-2-3",
      "name": "Medellin Pap 2",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-3-3",
      "name": "Medellin Pap 14",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-4-3",
      "name": "Medellin Pap 15",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-5-3",
      "name": "Medellin Pap 9",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-6-3",
      "name": "Medellin Pap 12",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-7-3",
      "name": "Medellin Pap 3",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-8-3",
      "name": "Medellin Pap 4",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-9-3",
      "name": "Oriente Pap Eficacia 1",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-10-3",
      "name": "Oriente Pap Eficacia 2",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    },
    {
      "id": "pdv-11-3",
      "name": "Oriente Pap Eficacia 4",
      "regionId": "region-andina",
      "subterritoryId": "sub-andina-norte",
      "city": "",
      "address": "Sin dirección",
      "contactName": "",
      "contactPhone": "",
      "contact": "",
      "notes": "",
      "complete": false
    }
  ]
};

export { validateNewPdv };
