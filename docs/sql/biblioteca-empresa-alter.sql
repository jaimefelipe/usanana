-- Add Id_Empresa + FK to Gen_Empresa where missing (MySQL)
-- Uses information_schema checks and dynamic SQL
-- NOTE: If you have existing rows, adjust DEFAULT 1 to your company id and update data as needed.

SET FOREIGN_KEY_CHECKS = 0;

-- Bib_Tipo_Material
SET @table_name = 'Bib_Tipo_Material';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_tipo_material_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Autor
SET @table_name = 'Bib_Autor';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_autor_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Editorial
SET @table_name = 'Bib_Editorial';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_editorial_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Categoria
SET @table_name = 'Bib_Categoria';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_categoria_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Libro
SET @table_name = 'Bib_Libro';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_libro_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Libro_Autor
SET @table_name = 'Bib_Libro_Autor';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_libro_autor_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Tesis
SET @table_name = 'Bib_Tesis';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_tesis_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Serial
SET @table_name = 'Bib_Serial';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_serial_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Ejemplar
SET @table_name = 'Bib_Ejemplar';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_ejemplar_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Usuario_Biblioteca
SET @table_name = 'Bib_Usuario_Biblioteca';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_usuario_biblioteca_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Proveedor
SET @table_name = 'Bib_Proveedor';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_proveedor_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Presupuesto
SET @table_name = 'Bib_Presupuesto';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_presupuesto_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Orden_Compra
SET @table_name = 'Bib_Orden_Compra';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_orden_compra_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Orden_Compra_Detalle
SET @table_name = 'Bib_Orden_Compra_Detalle';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_orden_compra_detalle_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Factura_Compra
SET @table_name = 'Bib_Factura_Compra';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_factura_compra_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Cotizacion
SET @table_name = 'Bib_Cotizacion';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_cotizacion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Sede
SET @table_name = 'Bib_Sede';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_sede_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Integracion
SET @table_name = 'Bib_Integracion';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_integracion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Politica_Prestamo
SET @table_name = 'Bib_Politica_Prestamo';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_politica_prestamo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Prestamo
SET @table_name = 'Bib_Prestamo';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_prestamo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Reserva
SET @table_name = 'Bib_Reserva';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_reserva_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Multa
SET @table_name = 'Bib_Multa';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_multa_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Auditoria_Circulacion
SET @table_name = 'Bib_Auditoria_Circulacion';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_auditoria_circulacion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Marc_Registro
SET @table_name = 'Bib_Marc_Registro';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_marc_registro_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Marc_Campo
SET @table_name = 'Bib_Marc_Campo';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_marc_campo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Marc_Subcampo
SET @table_name = 'Bib_Marc_Subcampo';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_marc_subcampo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Autoridad
SET @table_name = 'Bib_Autoridad';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_autoridad_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Autoridad_Campo
SET @table_name = 'Bib_Autoridad_Campo';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_autoridad_campo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Autoridad_Subcampo
SET @table_name = 'Bib_Autoridad_Subcampo';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_autoridad_subcampo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Suscripcion
SET @table_name = 'Bib_Suscripcion';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_suscripcion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Serial_Numero
SET @table_name = 'Bib_Serial_Numero';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_serial_numero_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Serial_Recepcion
SET @table_name = 'Bib_Serial_Recepcion';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_serial_recepcion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Opac_Comentario
SET @table_name = 'Bib_Opac_Comentario';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_opac_comentario_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Opac_Etiqueta
SET @table_name = 'Bib_Opac_Etiqueta';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_opac_etiqueta_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Opac_Lista
SET @table_name = 'Bib_Opac_Lista';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_opac_lista_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Opac_Lista_Item
SET @table_name = 'Bib_Opac_Lista_Item';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_opac_lista_item_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Opac_Historial_Busqueda
SET @table_name = 'Bib_Opac_Historial_Busqueda';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_opac_historial_busqueda_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Rol
SET @table_name = 'Bib_Rol';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_rol_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Permiso
SET @table_name = 'Bib_Permiso';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_permiso_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Rol_Permiso
SET @table_name = 'Bib_Rol_Permiso';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_rol_permiso_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Bib_Usuario_Rol
SET @table_name = 'Bib_Usuario_Rol';
SET @has_col = (SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa');
SET @sql = IF(@has_col = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD COLUMN Id_Empresa INT NOT NULL DEFAULT 1'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @has_fk = (SELECT COUNT(*) FROM information_schema.KEY_COLUMN_USAGE WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = @table_name AND COLUMN_NAME = 'Id_Empresa' AND REFERENCED_TABLE_NAME = 'Gen_Empresa');
SET @sql = IF(@has_fk = 0, CONCAT('ALTER TABLE ', @table_name, ' ADD CONSTRAINT fk_bib_usuario_rol_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)'), 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;