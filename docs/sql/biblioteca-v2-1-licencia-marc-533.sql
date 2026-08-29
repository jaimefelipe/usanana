-- Biblioteca USASJ v2.1 - Licencia visible via etiqueta MARC 533
-- Agrega Bib_Libro.Licencia, derivada del subcampo 533 $a al catalogar en MARC
-- (valores: 'CC-BY', 'CC-BY-SA', 'Licencia Privada'). Idempotente.

ALTER TABLE Bib_Libro ADD COLUMN IF NOT EXISTS Licencia VARCHAR(50) AFTER URL_Publica;
