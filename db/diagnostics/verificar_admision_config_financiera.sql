-- Diagnostico de configuracion financiera de admision.
-- Cambie @codigo_solicitud por el codigo que aparece en la solicitud, o deje NULL
-- y use @id_solicitud directamente.

SET @id_empresa := 1;
SET @codigo_solicitud := 'ADM-2026-12559021';
SET @id_solicitud := NULL;

SELECT
  s.Id_Admision_Solicitud,
  s.Codigo,
  s.Id_Empresa AS Solicitud_Empresa,
  s.Id_Carrera AS Solicitud_Id_Carrera,
  s.Nivel AS Solicitud_Nivel,
  c.Id_Carrera AS Carrera_Id_Carrera,
  c.Carrera,
  c.Nivel AS Carrera_Nivel,
  s.Id_Admision_Plan_Pago,
  s.Monto_Base_Estimado,
  s.Total_Estimado,
  s.Calculo_Pago_JSON
FROM Edu_Admision_Solicitud s
LEFT JOIN Edu_Carrera c
  ON c.Id_Carrera = s.Id_Carrera
WHERE s.Id_Empresa = @id_empresa
  AND (
    (@id_solicitud IS NOT NULL AND s.Id_Admision_Solicitud = @id_solicitud)
    OR (@id_solicitud IS NULL AND s.Codigo = @codigo_solicitud)
  );

SELECT
  f.Id_Config_Financiera,
  f.Id_Empresa,
  f.Id_Carrera,
  c.Carrera,
  f.Nivel,
  f.Moneda,
  f.Matricula_Bloque,
  f.Precio_Credito,
  f.Precio_Curso,
  f.Cursos_Por_Bloque,
  f.Creditos_Por_Curso,
  f.Activo,
  f.Modificado_El
FROM Edu_Admision_Config_Financiera f
LEFT JOIN Edu_Carrera c
  ON c.Id_Carrera = f.Id_Carrera
WHERE f.Id_Empresa = @id_empresa
ORDER BY f.Id_Carrera IS NULL, f.Id_Carrera, f.Nivel, f.Id_Config_Financiera DESC;

SELECT
  s.Id_Admision_Solicitud,
  s.Codigo,
  s.Id_Carrera,
  s.Nivel AS Solicitud_Nivel,
  c.Nivel AS Carrera_Nivel,
  f.Id_Config_Financiera,
  f.Id_Carrera AS Config_Id_Carrera,
  f.Nivel AS Config_Nivel,
  f.Moneda,
  f.Matricula_Bloque,
  f.Precio_Credito,
  f.Precio_Curso,
  f.Cursos_Por_Bloque,
  f.Creditos_Por_Curso,
  (f.Matricula_Bloque + CASE
    WHEN f.Precio_Curso > 0 THEN f.Precio_Curso * f.Cursos_Por_Bloque
    ELSE f.Precio_Credito * f.Creditos_Por_Curso * f.Cursos_Por_Bloque
  END) AS Monto_Base_Calculado
FROM Edu_Admision_Solicitud s
LEFT JOIN Edu_Carrera c
  ON c.Id_Carrera = s.Id_Carrera
LEFT JOIN Edu_Admision_Config_Financiera f
  ON f.Id_Empresa = s.Id_Empresa
 AND f.Activo = 1
 AND (
   f.Id_Carrera = s.Id_Carrera
   OR (f.Id_Carrera IS NULL AND f.Nivel = COALESCE(c.Nivel, s.Nivel))
 )
WHERE s.Id_Empresa = @id_empresa
  AND (
    (@id_solicitud IS NOT NULL AND s.Id_Admision_Solicitud = @id_solicitud)
    OR (@id_solicitud IS NULL AND s.Codigo = @codigo_solicitud)
  )
ORDER BY f.Id_Carrera IS NULL, f.Id_Config_Financiera DESC;

