-- Asocia Gen_Persona con Seg_Usuario por cedula/identificacion dentro de la misma empresa.
-- Reglas:
-- 1. Solo actualiza contactos sin Id_Usuario.
-- 2. Cruza por Seg_Usuario_Empresa.Id_Empresa para no mezclar empresas.
-- 3. Solo usa cedulas de usuario no ambiguas por empresa.
-- 4. Normaliza valores quitando espacios, guiones, puntos y slash comunes.

START TRANSACTION;

DROP TEMPORARY TABLE IF EXISTS tmp_seg_usuario_cedula_unica;

CREATE TEMPORARY TABLE tmp_seg_usuario_cedula_unica AS
SELECT
  sue.Id_Empresa,
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(TRIM(COALESCE(su.Numero_Identificacion, '')), '-', ''),
        ' ', ''),
      '.', ''),
    '/', ''),
  '\\', '') AS Cedula_Normalizada,
  MIN(su.Id_Usuario) AS Id_Usuario,
  MIN(su.Nombre) AS Nombre_Usuario,
  COUNT(DISTINCT su.Id_Usuario) AS Total_Usuarios
FROM Seg_Usuario su
INNER JOIN Seg_Usuario_Empresa sue
  ON sue.Id_Usuario = su.Id_Usuario
WHERE COALESCE(TRIM(su.Numero_Identificacion), '') <> ''
GROUP BY
  sue.Id_Empresa,
  REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(TRIM(COALESCE(su.Numero_Identificacion, '')), '-', ''),
        ' ', ''),
      '.', ''),
    '/', ''),
  '\\', '')
HAVING COUNT(DISTINCT su.Id_Usuario) = 1
  AND Cedula_Normalizada <> '';

-- Previsualizacion de registros que seran asociados.
SELECT
  p.Id_Empresa,
  p.Id_Persona,
  p.Nombre AS Nombre_Persona,
  p.Identificacion,
  u.Id_Usuario,
  u.Nombre_Usuario
FROM Gen_Persona p
INNER JOIN tmp_seg_usuario_cedula_unica u
  ON u.Id_Empresa = p.Id_Empresa
  AND u.Cedula_Normalizada = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(TRIM(COALESCE(p.Identificacion, '')), '-', ''),
        ' ', ''),
      '.', ''),
    '/', ''),
  '\\', '')
WHERE COALESCE(TRIM(p.Identificacion), '') <> ''
  AND (p.Id_Usuario IS NULL OR p.Id_Usuario = 0 OR p.Id_Usuario = '')
ORDER BY p.Id_Empresa, p.Id_Persona;

UPDATE Gen_Persona p
INNER JOIN tmp_seg_usuario_cedula_unica u
  ON u.Id_Empresa = p.Id_Empresa
  AND u.Cedula_Normalizada = REPLACE(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(TRIM(COALESCE(p.Identificacion, '')), '-', ''),
        ' ', ''),
      '.', ''),
    '/', ''),
  '\\', '')
SET
  p.Id_Usuario = u.Id_Usuario,
  p.Nombre_Usuario = u.Nombre_Usuario
WHERE COALESCE(TRIM(p.Identificacion), '') <> ''
  AND (p.Id_Usuario IS NULL OR p.Id_Usuario = 0 OR p.Id_Usuario = '');

SELECT ROW_COUNT() AS Registros_Asociados;

COMMIT;
