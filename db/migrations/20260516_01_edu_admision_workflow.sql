-- Admision y matricula automatizada de primer ingreso
-- Compatible con tablas existentes Edu_*, Gen_Persona, Seg_Usuario y Ven_Factura.

CREATE TABLE IF NOT EXISTS Edu_Admision_Solicitud (
  Id_Admision_Solicitud INT NOT NULL AUTO_INCREMENT,
  Id_Empresa INT NOT NULL,
  Codigo VARCHAR(40) NOT NULL,
  Id_Persona INT NULL,
  Nombre VARCHAR(250) NOT NULL,
  Tipo_Identificacion VARCHAR(10) NULL,
  Identificacion VARCHAR(80) NULL,
  Correo VARCHAR(200) NOT NULL,
  Telefono VARCHAR(80) NULL,
  Direccion TEXT NULL,
  Id_Carrera INT NOT NULL,
  Modalidad VARCHAR(60) NULL,
  Id_Sucursal INT NULL,
  Nivel VARCHAR(30) NULL,
  Colegio_Procedencia VARCHAR(200) NULL,
  Ultimo_Grado VARCHAR(120) NULL,
  Anio_Graduacion VARCHAR(10) NULL,
  Promedio VARCHAR(20) NULL,
  Observaciones TEXT NULL,
  Estado ENUM('solicitud_recibida','documentacion_incompleta','documentacion_completa','pendiente_aprobacion','aprobada','rechazada','admitida_condicionada','orden_pago','pago_pendiente','pago_en_revision','pago_aprobado','matriculado','alumno_activo') NOT NULL DEFAULT 'solicitud_recibida',
  Resultado_Admision ENUM('pendiente','aprobada','rechazada','condicionada') NOT NULL DEFAULT 'pendiente',
  Condiciones_Admision TEXT NULL,
  Id_Periodo_Academico INT NULL,
  Id_Matricula INT NULL,
  Id_Usuario_Estudiante INT NULL,
  Fecha_Envio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Fecha_Documentacion_Completa DATETIME NULL,
  Fecha_Aprobacion DATETIME NULL,
  Fecha_Matricula DATETIME NULL,
  Carta_Admision_URL VARCHAR(500) NULL,
  Portal_Token VARCHAR(128) NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Creado_Por VARCHAR(80) NULL,
  Modificado_El DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  Modificado_Por VARCHAR(80) NULL,
  PRIMARY KEY (Id_Admision_Solicitud),
  UNIQUE KEY uk_edu_admision_codigo (Id_Empresa, Codigo),
  KEY idx_edu_admision_estado (Id_Empresa, Estado),
  KEY idx_edu_admision_persona (Id_Empresa, Id_Persona),
  KEY idx_edu_admision_carrera (Id_Empresa, Id_Carrera)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Edu_Admision_Documento (
  Id_Admision_Documento INT NOT NULL AUTO_INCREMENT,
  Id_Empresa INT NOT NULL,
  Id_Admision_Solicitud INT NOT NULL,
  Tipo_Documento VARCHAR(80) NOT NULL,
  Nombre VARCHAR(160) NOT NULL,
  Requerido TINYINT(1) NOT NULL DEFAULT 1,
  URL VARCHAR(500) NULL,
  Nombre_Archivo VARCHAR(255) NULL,
  Mime_Type VARCHAR(150) NULL,
  Estado ENUM('pendiente','recibido','aprobado','rechazado','requiere_correccion') NOT NULL DEFAULT 'pendiente',
  Observacion TEXT NULL,
  Revisado_El DATETIME NULL,
  Revisado_Por VARCHAR(80) NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Creado_Por VARCHAR(80) NULL,
  Modificado_El DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  Modificado_Por VARCHAR(80) NULL,
  PRIMARY KEY (Id_Admision_Documento),
  UNIQUE KEY uk_edu_admision_doc_tipo (Id_Admision_Solicitud, Tipo_Documento),
  KEY idx_edu_admision_doc_estado (Id_Empresa, Estado),
  CONSTRAINT fk_edu_admision_doc_solicitud
    FOREIGN KEY (Id_Admision_Solicitud)
    REFERENCES Edu_Admision_Solicitud (Id_Admision_Solicitud)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Edu_Admision_Plan_Pago (
  Id_Admision_Plan_Pago INT NOT NULL AUTO_INCREMENT,
  Id_Empresa INT NOT NULL,
  Codigo VARCHAR(50) NOT NULL,
  Nombre VARCHAR(160) NOT NULL,
  Tipo ENUM('contado','mensual','periodo','financiamiento') NOT NULL,
  Descuento_Porcentaje DECIMAL(10,2) NOT NULL DEFAULT 0,
  Numero_Cuotas INT NOT NULL DEFAULT 1,
  Dias_Primer_Pago INT NOT NULL DEFAULT 8,
  Interes_Porcentaje DECIMAL(10,2) NOT NULL DEFAULT 0,
  Activo TINYINT(1) NOT NULL DEFAULT 1,
  Config_JSON LONGTEXT NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Creado_Por VARCHAR(80) NULL,
  Modificado_El DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  Modificado_Por VARCHAR(80) NULL,
  PRIMARY KEY (Id_Admision_Plan_Pago),
  UNIQUE KEY uk_edu_admision_plan_codigo (Id_Empresa, Codigo),
  KEY idx_edu_admision_plan_activo (Id_Empresa, Activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Edu_Admision_Orden_Pago (
  Id_Admision_Orden_Pago INT NOT NULL AUTO_INCREMENT,
  Id_Empresa INT NOT NULL,
  Id_Admision_Solicitud INT NOT NULL,
  Id_Admision_Plan_Pago INT NOT NULL,
  Referencia VARCHAR(60) NOT NULL,
  Concepto VARCHAR(255) NOT NULL,
  Moneda VARCHAR(10) NOT NULL DEFAULT 'CRC',
  Monto DECIMAL(18,5) NOT NULL DEFAULT 0,
  Descuento DECIMAL(18,5) NOT NULL DEFAULT 0,
  Total DECIMAL(18,5) NOT NULL DEFAULT 0,
  Fecha_Limite DATE NULL,
  Estado ENUM('pendiente','comprobante_recibido','aprobado','rechazado','incompleto','vencido') NOT NULL DEFAULT 'pendiente',
  Medio_Pago VARCHAR(80) NULL,
  Comprobante_URL VARCHAR(500) NULL,
  Observacion_Financiera TEXT NULL,
  Revisado_El DATETIME NULL,
  Revisado_Por VARCHAR(80) NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Creado_Por VARCHAR(80) NULL,
  Modificado_El DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  Modificado_Por VARCHAR(80) NULL,
  PRIMARY KEY (Id_Admision_Orden_Pago),
  UNIQUE KEY uk_edu_admision_orden_ref (Id_Empresa, Referencia),
  KEY idx_edu_admision_orden_solicitud (Id_Admision_Solicitud),
  KEY idx_edu_admision_orden_estado (Id_Empresa, Estado),
  CONSTRAINT fk_edu_admision_orden_solicitud
    FOREIGN KEY (Id_Admision_Solicitud)
    REFERENCES Edu_Admision_Solicitud (Id_Admision_Solicitud)
    ON DELETE CASCADE,
  CONSTRAINT fk_edu_admision_orden_plan
    FOREIGN KEY (Id_Admision_Plan_Pago)
    REFERENCES Edu_Admision_Plan_Pago (Id_Admision_Plan_Pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS Edu_Admision_Bitacora (
  Id_Admision_Bitacora INT NOT NULL AUTO_INCREMENT,
  Id_Empresa INT NOT NULL,
  Id_Admision_Solicitud INT NOT NULL,
  Estado_Anterior VARCHAR(60) NULL,
  Estado_Nuevo VARCHAR(60) NOT NULL,
  Accion VARCHAR(120) NOT NULL,
  Comentario TEXT NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Creado_Por VARCHAR(80) NULL,
  PRIMARY KEY (Id_Admision_Bitacora),
  KEY idx_edu_admision_bit_solicitud (Id_Admision_Solicitud, Creado_El),
  CONSTRAINT fk_edu_admision_bit_solicitud
    FOREIGN KEY (Id_Admision_Solicitud)
    REFERENCES Edu_Admision_Solicitud (Id_Admision_Solicitud)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Edu_Admision_Plan_Pago
  (Id_Empresa, Codigo, Nombre, Tipo, Descuento_Porcentaje, Numero_Cuotas, Dias_Primer_Pago, Activo, Creado_Por)
SELECT 1, 'CONTADO', 'Pago de contado', 'contado', 5, 1, 8, 1, 'migration'
WHERE NOT EXISTS (SELECT 1 FROM Edu_Admision_Plan_Pago WHERE Id_Empresa = 1 AND Codigo = 'CONTADO');

INSERT INTO Edu_Admision_Plan_Pago
  (Id_Empresa, Codigo, Nombre, Tipo, Descuento_Porcentaje, Numero_Cuotas, Dias_Primer_Pago, Activo, Creado_Por)
SELECT 1, 'MENSUAL', 'Pago mensual', 'mensual', 0, 4, 8, 1, 'migration'
WHERE NOT EXISTS (SELECT 1 FROM Edu_Admision_Plan_Pago WHERE Id_Empresa = 1 AND Codigo = 'MENSUAL');

INSERT INTO Edu_Admision_Plan_Pago
  (Id_Empresa, Codigo, Nombre, Tipo, Descuento_Porcentaje, Numero_Cuotas, Dias_Primer_Pago, Activo, Creado_Por)
SELECT 1, 'PERIODO', 'Pago por periodo', 'periodo', 0, 1, 8, 1, 'migration'
WHERE NOT EXISTS (SELECT 1 FROM Edu_Admision_Plan_Pago WHERE Id_Empresa = 1 AND Codigo = 'PERIODO');

INSERT INTO Edu_Admision_Plan_Pago
  (Id_Empresa, Codigo, Nombre, Tipo, Descuento_Porcentaje, Numero_Cuotas, Dias_Primer_Pago, Interes_Porcentaje, Activo, Creado_Por)
SELECT 1, 'FINANCIAMIENTO', 'Financiamiento interno', 'financiamiento', 0, 6, 8, 0, 1, 'migration'
WHERE NOT EXISTS (SELECT 1 FROM Edu_Admision_Plan_Pago WHERE Id_Empresa = 1 AND Codigo = 'FINANCIAMIENTO');

DROP PROCEDURE IF EXISTS sp_Edu_Admision_Activar_Alumno;
DELIMITER $$
CREATE PROCEDURE sp_Edu_Admision_Activar_Alumno(
  IN p_Id_Admision_Solicitud INT,
  IN p_Id_Empresa INT,
  IN p_Usuario VARCHAR(80)
)
BEGIN
  DECLARE v_Id_Persona INT DEFAULT NULL;
  DECLARE v_Id_Usuario INT DEFAULT NULL;
  DECLARE v_Id_Periodo INT DEFAULT NULL;
  DECLARE v_Id_Matricula INT DEFAULT NULL;
  DECLARE v_Id_Carrera INT DEFAULT NULL;
  DECLARE v_Nombre VARCHAR(250);
  DECLARE v_Correo VARCHAR(200);
  DECLARE v_Identificacion VARCHAR(80);
  DECLARE v_Tipo_Identificacion VARCHAR(10);
  DECLARE v_Estado VARCHAR(60);

  SELECT
    Id_Persona,
    Id_Usuario_Estudiante,
    Id_Periodo_Academico,
    Id_Carrera,
    Nombre,
    Correo,
    Identificacion,
    Tipo_Identificacion,
    Estado
  INTO
    v_Id_Persona,
    v_Id_Usuario,
    v_Id_Periodo,
    v_Id_Carrera,
    v_Nombre,
    v_Correo,
    v_Identificacion,
    v_Tipo_Identificacion,
    v_Estado
  FROM Edu_Admision_Solicitud
  WHERE Id_Admision_Solicitud = p_Id_Admision_Solicitud
    AND Id_Empresa = p_Id_Empresa
  LIMIT 1;

  IF v_Id_Carrera IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Solicitud de admision no encontrada';
  END IF;

  IF v_Id_Persona IS NULL THEN
    SELECT Id_Persona
      INTO v_Id_Persona
    FROM Gen_Persona
    WHERE Id_Empresa = p_Id_Empresa
      AND Identificacion = v_Identificacion
    LIMIT 1;
  END IF;

  IF v_Id_Persona IS NULL THEN
    INSERT INTO Gen_Persona (
      Id_Empresa,
      Nombre,
      Tipo_Identificacion,
      Identificacion,
      Correo,
      Telefono,
      Direccion,
      Cliente,
      Alumno,
      Estado,
      Creado_El,
      Creado_Por
    )
    SELECT
      Id_Empresa,
      Nombre,
      Tipo_Identificacion,
      Identificacion,
      Correo,
      Telefono,
      Direccion,
      1,
      1,
      1,
      NOW(),
      p_Usuario
    FROM Edu_Admision_Solicitud
    WHERE Id_Admision_Solicitud = p_Id_Admision_Solicitud;

    SET v_Id_Persona = LAST_INSERT_ID();
  ELSE
    UPDATE Gen_Persona
    SET Nombre = v_Nombre,
        Correo = v_Correo,
        Alumno = 1,
        Cliente = 1,
        Estado = 1,
        Modificado_El = NOW(),
        Modificado_Por = p_Usuario
    WHERE Id_Persona = v_Id_Persona;
  END IF;

  INSERT INTO Edu_Carrera_Estudiante (Id_Persona, Id_Carrera, Estado, Id_Empresa, Creado_Por, Creado_El)
  SELECT v_Id_Persona, v_Id_Carrera, 1, p_Id_Empresa, p_Usuario, NOW()
  WHERE NOT EXISTS (
    SELECT 1
    FROM Edu_Carrera_Estudiante
    WHERE Id_Persona = v_Id_Persona
      AND Id_Carrera = v_Id_Carrera
      AND Id_Empresa = p_Id_Empresa
  );

  IF v_Id_Periodo IS NULL THEN
    SELECT Id_Periodo_Academico
      INTO v_Id_Periodo
    FROM Edu_Periodo_Academico
    WHERE Estado = 1
    ORDER BY Inicio DESC, Id_Periodo_Academico DESC
    LIMIT 1;
  END IF;

  IF v_Id_Periodo IS NULL THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No existe periodo academico abierto';
  END IF;

  SELECT Id_Matricula
    INTO v_Id_Matricula
  FROM Edu_Matricula
  WHERE Id_Persona = v_Id_Persona
    AND Id_Periodo = v_Id_Periodo
  LIMIT 1;

  IF v_Id_Matricula IS NULL THEN
    INSERT INTO Edu_Matricula (Id_Persona, Id_Periodo, Id_Empresa, Creado_Por, Creado_El)
    VALUES (v_Id_Persona, v_Id_Periodo, p_Id_Empresa, p_Usuario, NOW());
    SET v_Id_Matricula = LAST_INSERT_ID();
  END IF;

  INSERT INTO Edu_Matricula_Detalle (Id_Matricula, Id_Grupo, Estado, Id_Empresa, Creado_Por, Creado_El)
  SELECT v_Id_Matricula, g.Id_Grupo, 1, p_Id_Empresa, p_Usuario, NOW()
  FROM Edu_Grupo g
  INNER JOIN Edu_Curso_Carrera cc
    ON cc.Id_Curso = g.Id_Curso
   AND cc.Id_Carrera = v_Id_Carrera
  WHERE g.Id_Empresa = p_Id_Empresa
    AND g.Id_Periodo = v_Id_Periodo
    AND g.Estado = 1
    AND COALESCE(cc.Bloque, 1) = 1
    AND NOT EXISTS (
      SELECT 1
      FROM Edu_Matricula_Detalle md
      WHERE md.Id_Matricula = v_Id_Matricula
        AND md.Id_Grupo = g.Id_Grupo
    );

  IF v_Id_Usuario IS NULL THEN
    SELECT Id_Usuario
      INTO v_Id_Usuario
    FROM Seg_Usuario
    WHERE Correo = v_Correo
    LIMIT 1;
  END IF;

  IF v_Id_Usuario IS NULL THEN
    INSERT INTO Seg_Usuario (
      Nombre,
      Nombre_Usuario,
      Correo,
      Clave,
      Tipo_Usuario,
      Estado,
      Academico,
      Numero_Identificacion,
      Creado_Por,
      Creado_El
    )
    VALUES (
      v_Nombre,
      LOWER(REPLACE(SUBSTRING_INDEX(v_Nombre, ' ', 2), ' ', '.')),
      v_Correo,
      'Password',
      'Alumno',
      1,
      1,
      v_Identificacion,
      p_Usuario,
      NOW()
    );
    SET v_Id_Usuario = LAST_INSERT_ID();
  ELSE
    UPDATE Seg_Usuario
    SET Estado = 1,
        Academico = 1,
        Modificado_Por = p_Usuario,
        Modificado_El = NOW()
    WHERE Id_Usuario = v_Id_Usuario;
  END IF;

  INSERT INTO Seg_Usuario_Empresa (Id_Usuario, Id_Empresa, Estado, Creado_Por, Creado_El)
  SELECT v_Id_Usuario, p_Id_Empresa, 1, p_Usuario, NOW()
  WHERE NOT EXISTS (
    SELECT 1
    FROM Seg_Usuario_Empresa
    WHERE Id_Usuario = v_Id_Usuario
      AND Id_Empresa = p_Id_Empresa
  );

  UPDATE Edu_Admision_Orden_Pago
  SET Estado = 'aprobado',
      Revisado_El = NOW(),
      Revisado_Por = p_Usuario
  WHERE Id_Admision_Solicitud = p_Id_Admision_Solicitud
    AND Estado IN ('pendiente','comprobante_recibido','incompleto');

  UPDATE Edu_Admision_Solicitud
  SET Id_Persona = v_Id_Persona,
      Id_Usuario_Estudiante = v_Id_Usuario,
      Id_Periodo_Academico = v_Id_Periodo,
      Id_Matricula = v_Id_Matricula,
      Estado = 'alumno_activo',
      Fecha_Matricula = NOW(),
      Modificado_El = NOW(),
      Modificado_Por = p_Usuario
  WHERE Id_Admision_Solicitud = p_Id_Admision_Solicitud;

  INSERT INTO Edu_Admision_Bitacora (
    Id_Empresa,
    Id_Admision_Solicitud,
    Estado_Anterior,
    Estado_Nuevo,
    Accion,
    Comentario,
    Creado_Por
  )
  VALUES (
    p_Id_Empresa,
    p_Id_Admision_Solicitud,
    v_Estado,
    'alumno_activo',
    'Matricula automatica',
    CONCAT('Persona ', v_Id_Persona, ', usuario ', v_Id_Usuario, ', matricula ', v_Id_Matricula),
    p_Usuario
  );

  SELECT
    'true' AS success,
    v_Id_Persona AS Id_Persona,
    v_Id_Usuario AS Id_Usuario,
    v_Id_Matricula AS Id_Matricula;
END$$
DELIMITER ;
