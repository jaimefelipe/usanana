-- Biblioteca USASJ v1.6.3 - Seguridad base predefinida
-- Crea roles institucionales, permisos canonicos y matriz rol-permiso.
-- Ejecutar una vez en MySQL/MariaDB por ambiente. Es idempotente.

INSERT INTO Bib_Rol (Id_Empresa, Nombre)
SELECT E.Id_Empresa, R.Nombre
FROM Gen_Empresa E
JOIN (
  SELECT 'Administrador' AS Nombre
  UNION ALL SELECT 'Bibliotecario'
  UNION ALL SELECT 'Docente'
  UNION ALL SELECT 'Estudiante'
  UNION ALL SELECT 'Administrativo'
) R
WHERE NOT EXISTS (
  SELECT 1
  FROM Bib_Rol BR
  WHERE BR.Id_Empresa = E.Id_Empresa
    AND BR.Nombre = R.Nombre
);

INSERT INTO Bib_Permiso (Id_Empresa, Codigo, Descripcion)
SELECT E.Id_Empresa, P.Codigo, P.Descripcion
FROM Gen_Empresa E
JOIN (
  SELECT 'biblioteca.seguridad.gestionar' AS Codigo, 'Gestionar seguridad, roles y permisos de biblioteca' AS Descripcion
  UNION ALL SELECT 'biblioteca.catalogacion.gestionar', 'Gestionar catalogacion, catalogos y ejemplares'
  UNION ALL SELECT 'biblioteca.archivo.subir', 'Subir archivos digitales en ejemplares'
  UNION ALL SELECT 'biblioteca.archivo.ver', 'Ver archivos digitales en ejemplares'
  UNION ALL SELECT 'biblioteca.circulacion.gestionar', 'Gestionar prestamos, reservas y circulacion digital'
  UNION ALL SELECT 'biblioteca.reportes.ver', 'Ver reportes de biblioteca'
  UNION ALL SELECT 'biblioteca.adquisiciones.gestionar', 'Gestionar adquisiciones de biblioteca'
  UNION ALL SELECT 'biblioteca.opac.gestionar', 'Gestionar contenidos sociales de OPAC'
  UNION ALL SELECT 'biblioteca.opac.ver', 'Consultar OPAC y catalogo publico'
  UNION ALL SELECT 'biblioteca.opac.reservar', 'Solicitar o reservar recursos digitales desde OPAC'
) P
WHERE NOT EXISTS (
  SELECT 1
  FROM Bib_Permiso BP
  WHERE BP.Id_Empresa = E.Id_Empresa
    AND BP.Codigo = P.Codigo
);

INSERT INTO Bib_Rol_Permiso (Id_Empresa, Rol_Id, Permiso_Id)
SELECT R.Id_Empresa, R.Id_Rol, P.Id_Permiso
FROM Bib_Rol R
JOIN Bib_Permiso P
  ON P.Id_Empresa = R.Id_Empresa
WHERE R.Nombre = 'Administrador'
  AND NOT EXISTS (
    SELECT 1
    FROM Bib_Rol_Permiso RP
    WHERE RP.Id_Empresa = R.Id_Empresa
      AND RP.Rol_Id = R.Id_Rol
      AND RP.Permiso_Id = P.Id_Permiso
  );

INSERT INTO Bib_Rol_Permiso (Id_Empresa, Rol_Id, Permiso_Id)
SELECT R.Id_Empresa, R.Id_Rol, P.Id_Permiso
FROM Bib_Rol R
JOIN Bib_Permiso P
  ON P.Id_Empresa = R.Id_Empresa
WHERE R.Nombre = 'Bibliotecario'
  AND P.Codigo IN (
    'biblioteca.catalogacion.gestionar',
    'biblioteca.archivo.subir',
    'biblioteca.archivo.ver',
    'biblioteca.circulacion.gestionar',
    'biblioteca.reportes.ver',
    'biblioteca.adquisiciones.gestionar',
    'biblioteca.opac.gestionar',
    'biblioteca.opac.ver',
    'biblioteca.opac.reservar'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM Bib_Rol_Permiso RP
    WHERE RP.Id_Empresa = R.Id_Empresa
      AND RP.Rol_Id = R.Id_Rol
      AND RP.Permiso_Id = P.Id_Permiso
  );

INSERT INTO Bib_Rol_Permiso (Id_Empresa, Rol_Id, Permiso_Id)
SELECT R.Id_Empresa, R.Id_Rol, P.Id_Permiso
FROM Bib_Rol R
JOIN Bib_Permiso P
  ON P.Id_Empresa = R.Id_Empresa
WHERE R.Nombre IN ('Docente', 'Estudiante', 'Administrativo')
  AND P.Codigo IN (
    'biblioteca.archivo.ver',
    'biblioteca.opac.ver',
    'biblioteca.opac.reservar'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM Bib_Rol_Permiso RP
    WHERE RP.Id_Empresa = R.Id_Empresa
      AND RP.Rol_Id = R.Id_Rol
      AND RP.Permiso_Id = P.Id_Permiso
  );
