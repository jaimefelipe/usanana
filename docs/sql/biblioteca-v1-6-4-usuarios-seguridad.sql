-- Biblioteca v1.6.4
-- Migracion de usuarios: eliminar Bib_Usuario_Biblioteca como tabla puente.
-- Objetivo: todas las referencias de usuario deben apuntar a Seg_Usuario.Id_Usuario.
--
-- Ejecutar primero en respaldo/staging y validar conteos antes de produccion.
-- Este script asume MySQL/MariaDB.

SET FOREIGN_KEY_CHECKS = 0;

-- 1) Migrar datos existentes desde Id_Usuario_Biblioteca hacia Seg_Usuario.Id_Usuario.
UPDATE Bib_Prestamo P
INNER JOIN Bib_Usuario_Biblioteca B ON P.Usuario_Id = B.Id_Usuario_Biblioteca
SET P.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Reserva R
INNER JOIN Bib_Usuario_Biblioteca B ON R.Usuario_Id = B.Id_Usuario_Biblioteca
SET R.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Multa M
INNER JOIN Bib_Usuario_Biblioteca B ON M.Usuario_Id = B.Id_Usuario_Biblioteca
SET M.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Auditoria_Circulacion A
INNER JOIN Bib_Usuario_Biblioteca B ON A.Usuario_Id = B.Id_Usuario_Biblioteca
SET A.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Opac_Comentario C
INNER JOIN Bib_Usuario_Biblioteca B ON C.Usuario_Id = B.Id_Usuario_Biblioteca
SET C.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Opac_Etiqueta E
INNER JOIN Bib_Usuario_Biblioteca B ON E.Usuario_Id = B.Id_Usuario_Biblioteca
SET E.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Opac_Lista L
INNER JOIN Bib_Usuario_Biblioteca B ON L.Usuario_Id = B.Id_Usuario_Biblioteca
SET L.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Opac_Historial_Busqueda H
INNER JOIN Bib_Usuario_Biblioteca B ON H.Usuario_Id = B.Id_Usuario_Biblioteca
SET H.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

UPDATE Bib_Bloqueo_Usuario BU
INNER JOIN Bib_Usuario_Biblioteca B ON BU.Usuario_Id = B.Id_Usuario_Biblioteca
SET BU.Usuario_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

-- 2) Migrar usuarios-roles a Seg_Usuario.
UPDATE Bib_Usuario_Rol UR
INNER JOIN Bib_Usuario_Biblioteca B ON UR.Usuario_Biblioteca_Id = B.Id_Usuario_Biblioteca
SET UR.Usuario_Biblioteca_Id = B.Id_Usuario
WHERE B.Id_Usuario IS NOT NULL;

ALTER TABLE Bib_Usuario_Rol
  CHANGE COLUMN Usuario_Biblioteca_Id Id_Usuario INT NOT NULL;

-- 3) Eliminar constraints viejos si existen. Ajustar nombres si la base usa nombres distintos.
ALTER TABLE Bib_Prestamo DROP FOREIGN KEY fk_prestamo_usuario;
ALTER TABLE Bib_Reserva DROP FOREIGN KEY fk_reserva_usuario;
ALTER TABLE Bib_Multa DROP FOREIGN KEY fk_multa_usuario;
ALTER TABLE Bib_Auditoria_Circulacion DROP FOREIGN KEY fk_auditoria_usuario;
ALTER TABLE Bib_Opac_Comentario DROP FOREIGN KEY fk_opac_comentario_usuario;
ALTER TABLE Bib_Opac_Etiqueta DROP FOREIGN KEY fk_opac_etiqueta_usuario;
ALTER TABLE Bib_Opac_Lista DROP FOREIGN KEY fk_opac_lista_usuario;
ALTER TABLE Bib_Opac_Historial_Busqueda DROP FOREIGN KEY fk_opac_historial_usuario;
ALTER TABLE Bib_Bloqueo_Usuario DROP FOREIGN KEY fk_bloqueo_usuario_usuario;
ALTER TABLE Bib_Usuario_Rol DROP FOREIGN KEY fk_usuario_rol_usuario;

-- 4) Crear constraints nuevos hacia Seg_Usuario.
ALTER TABLE Bib_Prestamo
  ADD CONSTRAINT fk_prestamo_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Reserva
  ADD CONSTRAINT fk_reserva_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Multa
  ADD CONSTRAINT fk_multa_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Auditoria_Circulacion
  ADD CONSTRAINT fk_auditoria_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Opac_Comentario
  ADD CONSTRAINT fk_opac_comentario_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Opac_Etiqueta
  ADD CONSTRAINT fk_opac_etiqueta_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Opac_Lista
  ADD CONSTRAINT fk_opac_lista_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Opac_Historial_Busqueda
  ADD CONSTRAINT fk_opac_historial_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Bloqueo_Usuario
  ADD CONSTRAINT fk_bloqueo_usuario_seg_usuario FOREIGN KEY (Usuario_Id) REFERENCES Seg_Usuario(Id_Usuario);
ALTER TABLE Bib_Usuario_Rol
  ADD CONSTRAINT fk_usuario_rol_seg_usuario FOREIGN KEY (Id_Usuario) REFERENCES Seg_Usuario(Id_Usuario);

ALTER TABLE Bib_Usuario_Rol
  DROP INDEX uq_usuario_rol,
  ADD UNIQUE KEY uq_usuario_rol (Id_Empresa, Id_Usuario, Rol_Id);

-- 5) Validar antes de borrar:
-- SELECT COUNT(*) AS pendientes_sin_seg_usuario FROM Bib_Usuario_Biblioteca WHERE Id_Usuario IS NULL;
-- Si el conteo anterior es 0, se puede eliminar la tabla.
DROP TABLE Bib_Usuario_Biblioteca;

SET FOREIGN_KEY_CHECKS = 1;
