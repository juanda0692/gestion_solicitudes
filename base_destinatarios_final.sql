-- Base de Destinatarios - Export completo de catálogos y tablas principales

CREATE DATABASE IF NOT EXISTS base_dest CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE base_dest;

DROP TABLE IF EXISTS solicitud_items;
DROP TABLE IF EXISTS solicitudes;
DROP TABLE IF EXISTS materiales_por_canal;
DROP TABLE IF EXISTS campañas;
DROP TABLE IF EXISTS materiales;
DROP TABLE IF EXISTS pdvs;
DROP TABLE IF EXISTS subterritorios;
DROP TABLE IF EXISTS canales;
DROP TABLE IF EXISTS regiones;

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

-- Catálogos
INSERT INTO regiones (id, nombre) VALUES
  ('region-norte', 'Región Norte'),
  ('region-sur', 'Región Sur');

INSERT INTO subterritorios (id, region_id, nombre) VALUES
  ('st-norte-1', 'region-norte', 'Subterritorio Norte 1'),
  ('st-sur-1',   'region-sur',   'Subterritorio Sur 1');

INSERT INTO pdvs (id, subterritorio_id, nombre) VALUES
  ('pdv-001', 'st-norte-1', 'PDV Uno'),
  ('pdv-002', 'st-sur-1',   'PDV Dos');

INSERT INTO canales (id, nombre) VALUES
  ('canal-mayorista', 'Mayorista'),
  ('canal-minorista', 'Minorista');

INSERT INTO materiales (id, nombre, descripcion, stock) VALUES
  ('mat-afiche',  'Afiche',  'Afiche promocional', 100),
  ('mat-display', 'Display', 'Display de cartón', 50);

INSERT INTO campañas (id, nombre, prioridad) VALUES
  ('camp-verano',   'Verano 2024',   1),
  ('camp-navidad',  'Navidad 2024',  2);

INSERT INTO materiales_por_canal (material_id, canal_id, stock) VALUES
  ('mat-afiche',  'canal-mayorista', 80),
  ('mat-afiche',  'canal-minorista', 20),
  ('mat-display', 'canal-mayorista', 50);

-- Ejemplos de solicitudes
INSERT INTO solicitudes (region_id, subterritorio_id, pdv_id, campaña_id, prioridad, zonas, observaciones, creado_por)
VALUES ('region-norte','st-norte-1','pdv-001','camp-verano',1,'["zonaA"]','Ejemplo de solicitud','demo');

INSERT INTO solicitud_items (solicitud_id, material_id, cantidad, medida_etiqueta, medida_custom, observaciones)
VALUES
  (1, 'mat-afiche', 10, NULL, NULL, NULL),
  (1, 'mat-display', 5, NULL, NULL, NULL);
