-- v1.4: vincula cada registro de autoridad a un autor del catalogo (Bib_Autor),
-- para que el mismo registro se reutilice en todos los libros de ese autor.
ALTER TABLE Bib_Autoridad
  ADD COLUMN IF NOT EXISTS Autor_Id INT NULL,
  ADD INDEX IF NOT EXISTS idx_bib_autoridad_autor (Autor_Id);
