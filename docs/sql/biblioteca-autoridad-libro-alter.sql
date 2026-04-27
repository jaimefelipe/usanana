-- Asegura que Bib_Autoridad_Campo pueda asociarse a un libro
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE Bib_Autoridad_Campo
  ADD COLUMN IF NOT EXISTS Libro_Id INT NULL;

SET @constraint_exists := (
  SELECT COUNT(*) 
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Bib_Autoridad_Campo'
    AND CONSTRAINT_NAME = 'fk_autoridad_campo_libro'
);

SET @sql := IF(
  @constraint_exists = 0,
  'ALTER TABLE Bib_Autoridad_Campo ADD CONSTRAINT fk_autoridad_campo_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE SET NULL',
  'SELECT 1'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;

