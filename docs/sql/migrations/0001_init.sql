-- Initial schema for Base Destinatarios
CREATE TABLE regiones (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE subterritorios (
  id VARCHAR(32) PRIMARY KEY,
  region_id VARCHAR(32) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  FOREIGN KEY (region_id) REFERENCES regiones(id)
);

CREATE TABLE pdvs (
  id VARCHAR(128) PRIMARY KEY,
  subterritorio_id VARCHAR(32) NOT NULL,
  nombre VARCHAR(150) NOT NULL,
  FOREIGN KEY (subterritorio_id) REFERENCES subterritorios(id)
);

CREATE TABLE canales (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE materiales (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  stock INT DEFAULT 0
);

CREATE TABLE campañas (
  id VARCHAR(32) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  prioridad INT DEFAULT 0
);

CREATE TABLE materiales_por_canal (
  material_id VARCHAR(32) NOT NULL,
  canal_id VARCHAR(32) NOT NULL,
  stock INT,
  PRIMARY KEY (material_id, canal_id),
  FOREIGN KEY (material_id) REFERENCES materiales(id),
  FOREIGN KEY (canal_id) REFERENCES canales(id)
);

CREATE TABLE solicitudes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region_id VARCHAR(32),
  subterritorio_id VARCHAR(32),
  pdv_id VARCHAR(128) NOT NULL,
  campaña_id VARCHAR(32),
  prioridad INT,
  zonas TEXT,
  observaciones TEXT,
  creado_por VARCHAR(100),
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regiones(id),
  FOREIGN KEY (subterritorio_id) REFERENCES subterritorios(id),
  FOREIGN KEY (pdv_id) REFERENCES pdvs(id),
  FOREIGN KEY (campaña_id) REFERENCES campañas(id)
);

CREATE TABLE solicitud_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  solicitud_id INT NOT NULL,
  material_id VARCHAR(32) NOT NULL,
  cantidad INT DEFAULT 0,
  medida_etiqueta VARCHAR(50),
  medida_custom VARCHAR(50),
  observaciones TEXT,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id),
  FOREIGN KEY (material_id) REFERENCES materiales(id)
);
