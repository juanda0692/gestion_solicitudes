# Data Dictionary

## regiones
- `id` VARCHAR(32) PK
- `nombre` VARCHAR(100)

## subterritorios
- `id` VARCHAR(32) PK
- `region_id` FK -> regiones.id
- `nombre` VARCHAR(100)

## pdvs
- `id` VARCHAR(128) PK
- `subterritorio_id` FK -> subterritorios.id
- `nombre` VARCHAR(150)

## canales
- `id` VARCHAR(32) PK
- `nombre` VARCHAR(100)

## materiales
- `id` VARCHAR(32) PK
- `nombre` VARCHAR(100)
- `descripcion` TEXT
- `stock` INT

## campañas
- `id` VARCHAR(32) PK
- `nombre` VARCHAR(100)
- `prioridad` INT (0=sin prioridad, 1 alta...)

## materiales_por_canal
- `material_id` FK -> materiales.id
- `canal_id` FK -> canales.id
- `stock` INT

## solicitudes
- `id` INT PK
- `region_id` FK -> regiones.id
- `subterritorio_id` FK -> subterritorios.id
- `pdv_id` FK -> pdvs.id
- `campaña_id` FK -> campañas.id
- `prioridad` INT
- `zonas` JSON
- `observaciones` TEXT
- `creado_por` VARCHAR(100)
- `creado_en` TIMESTAMP (UTC)

## solicitud_items
- `id` INT PK
- `solicitud_id` FK -> solicitudes.id
- `material_id` FK -> materiales.id
- `cantidad` INT
- `medida_etiqueta` VARCHAR(50)
- `medida_custom` VARCHAR(50)
- `observaciones` TEXT
- `creado_en` TIMESTAMP
