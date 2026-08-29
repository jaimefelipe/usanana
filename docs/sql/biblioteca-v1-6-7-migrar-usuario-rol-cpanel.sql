-- Biblioteca v1.6.7 - Migracion usuario-rol compatible con cPanel/phpMyAdmin.
-- No usa INFORMATION_SCHEMA porque algunos hostings compartidos lo bloquean.
--
-- IMPORTANTE:
-- 1) Primero ejecute:
--      DESCRIBE Bib_Usuario_Rol;
-- 2) Si aparece la columna Usuario_Biblioteca_Id y NO aparece Id_Usuario,
--    ejecute SOLO el bloque CASO A.
-- 3) Si ya aparece Id_Usuario, ejecute SOLO el bloque CASO B.
--
-- En la situacion reportada el script anterior ya corrio parcialmente, por lo
-- que normalmente corresponde CASO B.

-- ============================================================
-- CASO A: la tabla aun tiene Usuario_Biblioteca_Id
-- ============================================================
-- SET FOREIGN_KEY_CHECKS = 0;
--
-- UPDATE Bib_Usuario_Rol UR
-- INNER JOIN Bib_Usuario_Biblioteca B ON UR.Usuario_Biblioteca_Id = B.Id_Usuario_Biblioteca
-- SET UR.Usuario_Biblioteca_Id = B.Id_Usuario
-- WHERE B.Id_Usuario IS NOT NULL;
--
-- ALTER TABLE Bib_Usuario_Rol DROP FOREIGN KEY fk_usuario_rol_usuario;
--
-- ALTER TABLE Bib_Usuario_Rol
--   CHANGE COLUMN Usuario_Biblioteca_Id Id_Usuario INT NOT NULL;
--
-- ALTER TABLE Bib_Usuario_Rol
--   DROP INDEX uq_usuario_rol,
--   ADD UNIQUE KEY uq_usuario_rol (Id_Empresa, Id_Usuario, Rol_Id);
--
-- ALTER TABLE Bib_Usuario_Rol
--   ADD CONSTRAINT fk_usuario_rol_seg_usuario
--   FOREIGN KEY (Id_Usuario) REFERENCES Seg_Usuario(Id_Usuario);
--
-- SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- CASO B: la tabla ya tiene Id_Usuario
-- ============================================================
SET FOREIGN_KEY_CHECKS = 0;

ALTER TABLE Bib_Usuario_Rol
  DROP INDEX uq_usuario_rol,
  ADD UNIQUE KEY uq_usuario_rol (Id_Empresa, Id_Usuario, Rol_Id);

SET FOREIGN_KEY_CHECKS = 1;

SELECT
  Id_Usuario_Rol,
  Id_Empresa,
  Id_Usuario,
  Rol_Id
FROM Bib_Usuario_Rol
ORDER BY Id_Usuario_Rol
LIMIT 20;
