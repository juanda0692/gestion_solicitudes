-- Minimal catalogs for Base Destinatarios
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
