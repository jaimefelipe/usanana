DROP PROCEDURE IF EXISTS sp_Bib_Crear_Marc_Registro;
DROP PROCEDURE IF EXISTS sp_Bib_Asegurar_Marc_Control001;

DELIMITER $$

CREATE PROCEDURE sp_Bib_Crear_Marc_Registro(
  IN p_Libro_Id INT,
  IN p_Formato VARCHAR(50),
  IN p_Leader TEXT,
  IN p_Control_005 TEXT,
  IN p_Control_008 TEXT,
  IN p_Id_Empresa INT,
  IN p_Usuario VARCHAR(100)
)
BEGIN
  DECLARE v_Id_Marc_Registro INT DEFAULT NULL;
  DECLARE v_Control_001 VARCHAR(32) DEFAULT NULL;
  DECLARE v_Siguiente INT DEFAULT NULL;
  DECLARE v_LockName VARCHAR(100);

  SET v_LockName = CONCAT('sp_Bib_Marc_Control001_', p_Id_Empresa);

  SELECT Id_Marc_Registro, Control_001
    INTO v_Id_Marc_Registro, v_Control_001
  FROM Bib_Marc_Registro
  WHERE Libro_Id = p_Libro_Id
    AND Formato = p_Formato
    AND Id_Empresa = p_Id_Empresa
  ORDER BY Id_Marc_Registro DESC
  LIMIT 1;

  IF v_Id_Marc_Registro IS NULL THEN
    IF GET_LOCK(v_LockName, 10) = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se pudo obtener el bloqueo para generar el Control_001 MARC.';
    END IF;

    SELECT COALESCE(MIN(c.candidate), 1)
      INTO v_Siguiente
    FROM (
      SELECT 1 AS candidate
      UNION
      SELECT CAST(r.Control_001 AS UNSIGNED) + 1 AS candidate
      FROM Bib_Marc_Registro r
      WHERE r.Id_Empresa = p_Id_Empresa
        AND r.Control_001 IS NOT NULL
        AND r.Control_001 REGEXP '^[0-9][0-9]*$'
    ) c
    LEFT JOIN Bib_Marc_Registro existing
      ON existing.Id_Empresa = p_Id_Empresa
      AND existing.Control_001 IS NOT NULL
      AND existing.Control_001 REGEXP '^[0-9][0-9]*$'
      AND CAST(existing.Control_001 AS UNSIGNED) = c.candidate
    WHERE existing.Id_Marc_Registro IS NULL;

    SET v_Control_001 = LPAD(v_Siguiente, 3, '0');

    INSERT INTO Bib_Marc_Registro (
      Libro_Id, Formato, Leader, Control_001, Control_005, Control_008, Id_Empresa, Creado_Por, Creado_El
    ) VALUES (
      p_Libro_Id, p_Formato, p_Leader, v_Control_001, p_Control_005, p_Control_008, p_Id_Empresa, p_Usuario, NOW()
    );

    SET v_Id_Marc_Registro = LAST_INSERT_ID();

    DO RELEASE_LOCK(v_LockName);
  ELSEIF v_Control_001 IS NULL OR CHAR_LENGTH(v_Control_001) = 0 THEN
    IF GET_LOCK(v_LockName, 10) = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se pudo obtener el bloqueo para completar el Control_001 MARC.';
    END IF;

    SELECT COALESCE(MIN(c.candidate), 1)
      INTO v_Siguiente
    FROM (
      SELECT 1 AS candidate
      UNION
      SELECT CAST(r.Control_001 AS UNSIGNED) + 1 AS candidate
      FROM Bib_Marc_Registro r
      WHERE r.Id_Empresa = p_Id_Empresa
        AND r.Control_001 IS NOT NULL
        AND r.Control_001 REGEXP '^[0-9][0-9]*$'
    ) c
    LEFT JOIN Bib_Marc_Registro existing
      ON existing.Id_Empresa = p_Id_Empresa
      AND existing.Control_001 IS NOT NULL
      AND existing.Control_001 REGEXP '^[0-9][0-9]*$'
      AND CAST(existing.Control_001 AS UNSIGNED) = c.candidate
    WHERE existing.Id_Marc_Registro IS NULL;

    SET v_Control_001 = LPAD(v_Siguiente, 3, '0');

    UPDATE Bib_Marc_Registro
    SET Control_001 = v_Control_001
    WHERE Id_Marc_Registro = v_Id_Marc_Registro
      AND Id_Empresa = p_Id_Empresa;

    DO RELEASE_LOCK(v_LockName);
  END IF;

  SELECT v_Id_Marc_Registro AS Id_Marc_Registro, v_Control_001 AS Control_001;
END $$

CREATE PROCEDURE sp_Bib_Asegurar_Marc_Control001(
  IN p_Id_Marc_Registro INT,
  IN p_Id_Empresa INT
)
BEGIN
  DECLARE v_Control_001 VARCHAR(32) DEFAULT NULL;
  DECLARE v_Siguiente INT DEFAULT NULL;
  DECLARE v_LockName VARCHAR(100);

  SET v_LockName = CONCAT('sp_Bib_Marc_Control001_', p_Id_Empresa);

  SELECT Control_001
    INTO v_Control_001
  FROM Bib_Marc_Registro
  WHERE Id_Marc_Registro = p_Id_Marc_Registro
    AND Id_Empresa = p_Id_Empresa
  LIMIT 1;

  IF v_Control_001 IS NULL OR CHAR_LENGTH(v_Control_001) = 0 THEN
    IF GET_LOCK(v_LockName, 10) = 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No se pudo obtener el bloqueo para asignar el Control_001 MARC.';
    END IF;

    SELECT COALESCE(MIN(c.candidate), 1)
      INTO v_Siguiente
    FROM (
      SELECT 1 AS candidate
      UNION
      SELECT CAST(r.Control_001 AS UNSIGNED) + 1 AS candidate
      FROM Bib_Marc_Registro r
      WHERE r.Id_Empresa = p_Id_Empresa
        AND r.Control_001 IS NOT NULL
        AND r.Control_001 REGEXP '^[0-9][0-9]*$'
    ) c
    LEFT JOIN Bib_Marc_Registro existing
      ON existing.Id_Empresa = p_Id_Empresa
      AND existing.Control_001 IS NOT NULL
      AND existing.Control_001 REGEXP '^[0-9][0-9]*$'
      AND CAST(existing.Control_001 AS UNSIGNED) = c.candidate
    WHERE existing.Id_Marc_Registro IS NULL;

    SET v_Control_001 = LPAD(v_Siguiente, 3, '0');

    UPDATE Bib_Marc_Registro
    SET Control_001 = v_Control_001
    WHERE Id_Marc_Registro = p_Id_Marc_Registro
      AND Id_Empresa = p_Id_Empresa;

    DO RELEASE_LOCK(v_LockName);
  END IF;

  SELECT p_Id_Marc_Registro AS Id_Marc_Registro, v_Control_001 AS Control_001;
END $$

DELIMITER ;
