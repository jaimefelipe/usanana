-- Biblioteca USASJ v1.6.1 - Permiso para subir archivos digitales en Ejemplares
-- Ejecutar si el boton Archivo digital aparece deshabilitado para bibliotecarios/admin.

INSERT INTO Bib_Permiso (Id_Empresa, Codigo, Descripcion)
SELECT E.Id_Empresa, 'biblioteca.archivo.subir', 'Subir archivos digitales en ejemplares de biblioteca'
FROM Gen_Empresa E
WHERE NOT EXISTS (
  SELECT 1
  FROM Bib_Permiso P
  WHERE P.Id_Empresa = E.Id_Empresa
    AND P.Codigo = 'biblioteca.archivo.subir'
);

INSERT INTO Bib_Permiso (Id_Empresa, Codigo, Descripcion)
SELECT E.Id_Empresa, 'biblioteca.archivo.ver', 'Ver archivos digitales en ejemplares de biblioteca'
FROM Gen_Empresa E
WHERE NOT EXISTS (
  SELECT 1
  FROM Bib_Permiso P
  WHERE P.Id_Empresa = E.Id_Empresa
    AND P.Codigo = 'biblioteca.archivo.ver'
);

INSERT INTO Bib_Rol_Permiso (Id_Empresa, Rol_Id, Permiso_Id)
SELECT R.Id_Empresa, R.Id_Rol, P.Id_Permiso
FROM Bib_Rol R
INNER JOIN Bib_Permiso P
  ON P.Id_Empresa = R.Id_Empresa
 AND P.Codigo IN ('biblioteca.archivo.subir', 'biblioteca.archivo.ver')
WHERE LOWER(R.Nombre) IN ('admin', 'administrador', 'bibliotecario')
  AND NOT EXISTS (
    SELECT 1
    FROM Bib_Rol_Permiso RP
    WHERE RP.Id_Empresa = R.Id_Empresa
      AND RP.Rol_Id = R.Id_Rol
      AND RP.Permiso_Id = P.Id_Permiso
  );
