-- Biblioteca v1.6.7
-- Correccion puntual e idempotente para asignacion de roles con usuario unico.
--
-- Causa del error original:
--   Unknown column Id_Usuario in INSERT INTO
--
-- Arquitectura correcta:
--   Bib_Usuario_Rol.Id_Usuario -> Seg_Usuario.Id_Usuario
--
-- Este script se puede ejecutar aunque la tabla haya quedado parcialmente
-- migrada: valida columnas, indices y llaves foraneas antes de alterar.

SET @schema_name = DATABASE();
SET FOREIGN_KEY_CHECKS = 0;

SELECT COUNT(*) INTO @has_old_column
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Rol'
  AND COLUMN_NAME = 'Usuario_Biblioteca_Id';

SELECT COUNT(*) INTO @has_new_column
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Rol'
  AND COLUMN_NAME = 'Id_Usuario';

SELECT COUNT(*) INTO @has_bridge_table
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Biblioteca';

-- Migrar valores existentes solo si todavia existe la columna antigua.
SET @sql = IF(
  @has_old_column > 0 AND @has_bridge_table > 0,
  'UPDATE Bib_Usuario_Rol UR
   INNER JOIN Bib_Usuario_Biblioteca B ON UR.Usuario_Biblioteca_Id = B.Id_Usuario_Biblioteca
   SET UR.Usuario_Biblioteca_Id = B.Id_Usuario
   WHERE B.Id_Usuario IS NOT NULL',
  'SELECT ''No hay columna antigua Usuario_Biblioteca_Id para migrar'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar cualquier FK que apunte desde la columna antigua.
SET @old_fk_name = NULL;

SELECT CONSTRAINT_NAME INTO @old_fk_name
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Rol'
  AND COLUMN_NAME = 'Usuario_Biblioteca_Id'
  AND REFERENCED_TABLE_NAME IS NOT NULL
LIMIT 1;

SET @sql = IF(
  @old_fk_name IS NOT NULL,
  CONCAT('ALTER TABLE Bib_Usuario_Rol DROP FOREIGN KEY ', @old_fk_name),
  'SELECT ''No hay FK antigua por eliminar'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Renombrar columna solo si existe la antigua y no existe la nueva.
SET @sql = IF(
  @has_old_column > 0 AND @has_new_column = 0,
  'ALTER TABLE Bib_Usuario_Rol CHANGE COLUMN Usuario_Biblioteca_Id Id_Usuario INT NOT NULL',
  'SELECT ''La columna Id_Usuario ya existe o la antigua no existe'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Refrescar estado de columna nueva despues del posible rename.
SELECT COUNT(*) INTO @has_new_column
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Rol'
  AND COLUMN_NAME = 'Id_Usuario';

-- Rehacer indice unico solo si Id_Usuario existe.
SELECT COUNT(*) INTO @has_uq_usuario_rol
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Rol'
  AND INDEX_NAME = 'uq_usuario_rol';

SET @sql = IF(
  @has_new_column > 0 AND @has_uq_usuario_rol > 0,
  'ALTER TABLE Bib_Usuario_Rol DROP INDEX uq_usuario_rol',
  'SELECT ''No se requiere eliminar uq_usuario_rol'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SELECT COUNT(*) INTO @has_uq_usuario_rol
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Rol'
  AND INDEX_NAME = 'uq_usuario_rol';

SET @sql = IF(
  @has_new_column > 0 AND @has_uq_usuario_rol = 0,
  'ALTER TABLE Bib_Usuario_Rol ADD UNIQUE KEY uq_usuario_rol (Id_Empresa, Id_Usuario, Rol_Id)',
  'SELECT ''Indice uq_usuario_rol ya existe o falta Id_Usuario'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear FK nueva solo si no existe.
SELECT COUNT(*) INTO @has_new_fk
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = @schema_name
  AND TABLE_NAME = 'Bib_Usuario_Rol'
  AND CONSTRAINT_NAME = 'fk_usuario_rol_seg_usuario'
  AND CONSTRAINT_TYPE = 'FOREIGN KEY';

SET @sql = IF(
  @has_new_column > 0 AND @has_new_fk = 0,
  'ALTER TABLE Bib_Usuario_Rol
     ADD CONSTRAINT fk_usuario_rol_seg_usuario
     FOREIGN KEY (Id_Usuario) REFERENCES Seg_Usuario(Id_Usuario)',
  'SELECT ''FK fk_usuario_rol_seg_usuario ya existe o falta Id_Usuario'' AS info'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;

SELECT
  'Bib_Usuario_Rol' AS Tabla,
  @has_old_column AS Tenia_Usuario_Biblioteca_Id,
  @has_new_column AS Tiene_Id_Usuario,
  @has_new_fk AS Tenia_FK_Nueva_Antes_De_Crear;
