-- Schema para Supabase (PostgreSQL) - Base Destinatarios
-- Convertido desde MySQL a PostgreSQL

-- Tabla de regiones
CREATE TABLE regiones (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de subterritorios
CREATE TABLE subterritorios (
  id VARCHAR(32) PRIMARY KEY,
  region_id VARCHAR(32) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (region_id) REFERENCES regiones(id)
);

-- Tabla de PDVs
CREATE TABLE pdvs (
  id VARCHAR(128) PRIMARY KEY,
  subterritorio_id VARCHAR(32) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (subterritorio_id) REFERENCES subterritorios(id)
);

-- Tabla de canales
CREATE TABLE canales (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de materiales
CREATE TABLE materiales (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de campañas
CREATE TABLE campañas (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  prioridad INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de materiales por canal
CREATE TABLE materiales_por_canal (
  material_id VARCHAR(32) NOT NULL,
  canal_id VARCHAR(32) NOT NULL,
  stock INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (material_id, canal_id),
  FOREIGN KEY (material_id) REFERENCES materiales(id),
  FOREIGN KEY (canal_id) REFERENCES canales(id)
);

-- Tabla de solicitudes
CREATE TABLE solicitudes (
  id SERIAL PRIMARY KEY,
  region_id VARCHAR(32),
  subterritorio_id VARCHAR(32),
  pdv_id VARCHAR(128) NOT NULL,
  campaña_id VARCHAR(32),
  prioridad INTEGER,
  zonas JSONB,
  observaciones TEXT,
  creado_por VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (region_id) REFERENCES regiones(id),
  FOREIGN KEY (subterritorio_id) REFERENCES subterritorios(id),
  FOREIGN KEY (pdv_id) REFERENCES pdvs(id),
  FOREIGN KEY (campaña_id) REFERENCES campañas(id)
);

-- Tabla de items de solicitud
CREATE TABLE solicitud_items (
  id SERIAL PRIMARY KEY,
  solicitud_id INTEGER NOT NULL,
  material_id VARCHAR(32) NOT NULL,
  cantidad INTEGER DEFAULT 0,
  medida_etiqueta VARCHAR(50),
  medida_custom VARCHAR(50),
  observaciones TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
  FOREIGN KEY (material_id) REFERENCES materiales(id)
);

-- Índices para mejorar performance
CREATE INDEX idx_subterritorios_region_id ON subterritorios(region_id);
CREATE INDEX idx_pdvs_subterritorio_id ON pdvs(subterritorio_id);
CREATE INDEX idx_materiales_por_canal_canal_id ON materiales_por_canal(canal_id);
CREATE INDEX idx_materiales_por_canal_material_id ON materiales_por_canal(material_id);
CREATE INDEX idx_solicitudes_region_id ON solicitudes(region_id);
CREATE INDEX idx_solicitudes_subterritorio_id ON solicitudes(subterritorio_id);
CREATE INDEX idx_solicitudes_pdv_id ON solicitudes(pdv_id);
CREATE INDEX idx_solicitudes_campaña_id ON solicitudes(campaña_id);
CREATE INDEX idx_solicitudes_created_at ON solicitudes(created_at);
CREATE INDEX idx_solicitud_items_solicitud_id ON solicitud_items(solicitud_id);
CREATE INDEX idx_solicitud_items_material_id ON solicitud_items(material_id);

-- Habilitar Row Level Security (RLS)
ALTER TABLE regiones ENABLE ROW LEVEL SECURITY;
ALTER TABLE subterritorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdvs ENABLE ROW LEVEL SECURITY;
ALTER TABLE canales ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales ENABLE ROW LEVEL SECURITY;
ALTER TABLE materiales_por_canal ENABLE ROW LEVEL SECURITY;
ALTER TABLE campañas ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitud_items ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (permitir todo por ahora - ajustar según necesidades de seguridad)
CREATE POLICY "Allow all operations" ON regiones FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON subterritorios FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON pdvs FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON canales FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON materiales FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON materiales_por_canal FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON campañas FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON solicitudes FOR ALL USING (true);
CREATE POLICY "Allow all operations" ON solicitud_items FOR ALL USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_regiones_updated_at BEFORE UPDATE ON regiones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subterritorios_updated_at BEFORE UPDATE ON subterritorios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pdvs_updated_at BEFORE UPDATE ON pdvs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_canales_updated_at BEFORE UPDATE ON canales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materiales_updated_at BEFORE UPDATE ON materiales FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_materiales_por_canal_updated_at BEFORE UPDATE ON materiales_por_canal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campañas_updated_at BEFORE UPDATE ON campañas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solicitudes_updated_at BEFORE UPDATE ON solicitudes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_solicitud_items_updated_at BEFORE UPDATE ON solicitud_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
