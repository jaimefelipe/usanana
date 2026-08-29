-- Biblioteca USASJ v1.6 - Politicas de circulacion y bloqueos de usuario
-- Ejecutar en MySQL/MariaDB antes de usar la validacion de limite combinado.

ALTER TABLE Bib_Politica_Prestamo
  ADD COLUMN IF NOT EXISTS Max_Reservas INT NOT NULL DEFAULT 2 AFTER Max_Prestamos;

CREATE TABLE IF NOT EXISTS Bib_Bloqueo_Usuario (
  Id_Bloqueo_Usuario INT NOT NULL AUTO_INCREMENT,
  Usuario_Id INT NOT NULL,
  Motivo VARCHAR(255) NOT NULL DEFAULT '',
  Fecha_Inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Fecha_Fin DATETIME NULL,
  Estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
  Id_Empresa INT NOT NULL,
  Creado_Por VARCHAR(120) NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Modificado_Por VARCHAR(120) NULL,
  Modificado_El DATETIME NULL,
  PRIMARY KEY (Id_Bloqueo_Usuario),
  INDEX idx_bloqueo_usuario_empresa_estado (Id_Empresa, Usuario_Id, Estado),
  CONSTRAINT fk_bloqueo_usuario_biblioteca
    FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca),
  CONSTRAINT fk_bloqueo_usuario_empresa
    FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)
);

INSERT INTO Bib_Politica_Prestamo (
  Id_Empresa,
  Tipo_Usuario,
  Tipo_Material_Id,
  Dias_Prestamo,
  Max_Renovaciones,
  Max_Prestamos,
  Max_Reservas,
  Multa_Diaria
)
SELECT
  E.Id_Empresa,
  'General',
  TM.Id_Tipo_Material,
  7,
  0,
  2,
  2,
  0.00
FROM Gen_Empresa E
INNER JOIN Bib_Tipo_Material TM
  ON TM.Id_Empresa = E.Id_Empresa
WHERE NOT EXISTS (
  SELECT 1
  FROM Bib_Politica_Prestamo P
  WHERE P.Id_Empresa = E.Id_Empresa
)
  AND TM.Id_Tipo_Material = (
    SELECT MIN(TM2.Id_Tipo_Material)
    FROM Bib_Tipo_Material TM2
    WHERE TM2.Id_Empresa = E.Id_Empresa
  );
