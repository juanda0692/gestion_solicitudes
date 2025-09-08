-- Datos de prueba para Base Destinatarios en Supabase

-- Insertar regiones
INSERT INTO regiones (id, nombre) VALUES 
('REG001', 'Región Norte'),
('REG002', 'Región Centro'),
('REG003', 'Región Sur');

-- Insertar subterritorios
INSERT INTO subterritorios (id, region_id, nombre) VALUES 
('SUB001', 'REG001', 'Norte A'),
('SUB002', 'REG001', 'Norte B'),
('SUB003', 'REG002', 'Centro A'),
('SUB004', 'REG002', 'Centro B'),
('SUB005', 'REG003', 'Sur A'),
('SUB006', 'REG003', 'Sur B');

-- Insertar PDVs
INSERT INTO pdvs (id, subterritorio_id, nombre) VALUES 
('PDV001', 'SUB001', 'Tienda Norte Plaza'),
('PDV002', 'SUB001', 'Tienda Norte Mall'),
('PDV003', 'SUB002', 'Tienda Norte Centro'),
('PDV004', 'SUB003', 'Tienda Centro Principal'),
('PDV005', 'SUB004', 'Tienda Centro Comercial'),
('PDV006', 'SUB005', 'Tienda Sur Plaza'),
('PDV007', 'SUB006', 'Tienda Sur Mall');

-- Insertar canales
INSERT INTO canales (id, nombre) VALUES 
('CAN001', 'Retail'),
('CAN002', 'Mayorista'),
('CAN003', 'Digital'),
('CAN004', 'Corporativo');

-- Insertar materiales
INSERT INTO materiales (id, nombre, descripcion, stock) VALUES 
('MAT001', 'Banner 2x1m', 'Banner promocional 2x1 metros', 100),
('MAT002', 'Volante A4', 'Volante promocional tamaño A4', 500),
('MAT003', 'Póster A3', 'Póster promocional tamaño A3', 200),
('MAT004', 'Sticker Redondo', 'Sticker promocional redondo', 1000),
('MAT005', 'Brochure', 'Brochure informativo', 300),
('MAT006', 'Display Mesa', 'Display para mesa', 50),
('MAT007', 'Pendón 1x2m', 'Pendón vertical 1x2 metros', 75),
('MAT008', 'Calcomanía', 'Calcomanía promocional', 800);

-- Insertar campañas
INSERT INTO campañas (id, nombre, prioridad) VALUES 
('CAM001', 'Campaña Verano 2024', 1),
('CAM002', 'Black Friday 2024', 2),
('CAM003', 'Navidad 2024', 1),
('CAM004', 'Año Nuevo 2025', 3),
('CAM005', 'San Valentín 2025', 2);

-- Insertar materiales por canal
INSERT INTO materiales_por_canal (material_id, canal_id, stock) VALUES 
-- Canal Retail
('MAT001', 'CAN001', 50),
('MAT002', 'CAN001', 200),
('MAT003', 'CAN001', 100),
('MAT004', 'CAN001', 500),
('MAT005', 'CAN001', 150),

-- Canal Mayorista
('MAT001', 'CAN002', 30),
('MAT002', 'CAN002', 300),
('MAT006', 'CAN002', 25),
('MAT007', 'CAN002', 40),
('MAT008', 'CAN002', 400),

-- Canal Digital
('MAT003', 'CAN003', 80),
('MAT004', 'CAN003', 300),
('MAT005', 'CAN003', 100),

-- Canal Corporativo
('MAT001', 'CAN004', 20),
('MAT005', 'CAN004', 50),
('MAT006', 'CAN004', 15),
('MAT007', 'CAN004', 35);

-- Insertar algunas solicitudes de ejemplo
INSERT INTO solicitudes (region_id, subterritorio_id, pdv_id, campaña_id, prioridad, zonas, observaciones, creado_por) VALUES 
('REG001', 'SUB001', 'PDV001', 'CAM001', 1, '["Zona A", "Zona B"]'::jsonb, 'Solicitud urgente para campaña de verano', 'usuario1'),
('REG002', 'SUB003', 'PDV004', 'CAM002', 2, '["Zona Centro"]'::jsonb, 'Material para Black Friday', 'usuario2'),
('REG003', 'SUB005', 'PDV006', 'CAM003', 1, '["Zona Sur A", "Zona Sur B"]'::jsonb, 'Preparación navideña', 'usuario3');

-- Insertar items de solicitud
INSERT INTO solicitud_items (solicitud_id, material_id, cantidad, medida_etiqueta, observaciones) VALUES 
-- Items para solicitud 1
(1, 'MAT001', 5, 'unidades', 'Para entrada principal'),
(1, 'MAT002', 100, 'unidades', 'Distribución en tienda'),
(1, 'MAT004', 50, 'unidades', 'Para productos destacados'),

-- Items para solicitud 2
(2, 'MAT003', 10, 'unidades', 'Vitrinas principales'),
(2, 'MAT005', 25, 'unidades', 'Información de ofertas'),
(2, 'MAT007', 3, 'unidades', 'Entrada de tienda'),

-- Items para solicitud 3
(3, 'MAT001', 8, 'unidades', 'Decoración navideña'),
(3, 'MAT006', 2, 'unidades', 'Displays especiales'),
(3, 'MAT008', 75, 'unidades', 'Productos navideños');
