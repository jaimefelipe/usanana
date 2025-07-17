CREATE DEFINER=`toxoqfbh_jbrenes`@`localhost` PROCEDURE `sp_Inv_Auditar_Existencia_TomaFisica`(
    IN p_Id_Toma_Fisica INT
)
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE done2 INT DEFAULT FALSE;
  DECLARE v_Fecha_Toma DATETIME;
  DECLARE v_Id_Empresa INT;
  DECLARE v_Id_Producto INT;
  DECLARE v_Fecha_Inicial DATETIME;
  DECLARE v_ExistenciaEsperada DECIMAL(18,5);
  DECLARE v_Fecha_Final DATETIME;
  DECLARE v_Id_Toma_Fisica_Siguiente INT;

  DECLARE mv_Id INT;
  DECLARE mv_Fecha DATETIME;
  DECLARE mv_Tipo VARCHAR(2);
  DECLARE mv_Cant DECIMAL(18,5);

  DECLARE cur CURSOR FOR
    SELECT Id_Empresa, Id_Producto, Fecha_Inicial
    FROM tmp_toma_productos;

  DECLARE cur_mov CURSOR FOR
    SELECT m.Id_Movimiento, m.Creado_El, m.Tipo_Movimiento, md.Cantidad
    FROM Inv_Movimiento m
    INNER JOIN Inv_Movimiento_Detalle md ON m.Id_Movimiento = md.Id_Movimiento
    WHERE m.Id_Empresa = v_Id_Empresa
      AND md.Id_Producto = v_Id_Producto
      AND m.Estado = 1
      AND m.Creado_El >= v_Fecha_Inicial
    ORDER BY m.Creado_El;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
  DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done2 = TRUE;

  -- LOCK
  IF GET_LOCK('sp_Inv_Auditar_Existencia_TomaFisica_LOCK', 10) = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Proceso bloqueado por otra ejecución simultánea para esta toma física.';
  END IF;

  SELECT Fecha INTO v_Fecha_Toma
  FROM Inv_Toma_Fisica
  WHERE Id_Toma_Fisica = p_Id_Toma_Fisica;

  DROP TEMPORARY TABLE IF EXISTS tmp_toma_productos;
  CREATE TEMPORARY TABLE tmp_toma_productos (
    Id_Empresa INT,
    Id_Producto INT,
    Fecha_Inicial DATETIME,
    Cantidad_Contada DECIMAL(18,5),
    Fecha_Final DATETIME DEFAULT NULL,
    Id_Toma_Fisica_Siguiente INT DEFAULT NULL
  );

  INSERT INTO tmp_toma_productos (Id_Empresa, Id_Producto, Fecha_Inicial, Cantidad_Contada)
  SELECT tf.Id_Empresa, d.Id_Producto, tf.Fecha, d.Cantidad_Contada
  FROM Inv_Toma_Fisica tf
  INNER JOIN Inv_Toma_Fisica_Detalle d ON tf.Id_Toma_Fisica = d.Id_Toma_Fisica
  WHERE tf.Id_Toma_Fisica = p_Id_Toma_Fisica;

  UPDATE tmp_toma_productos p
  SET Id_Toma_Fisica_Siguiente = (
    SELECT tf2.Id_Toma_Fisica
    FROM Inv_Toma_Fisica tf2
    INNER JOIN Inv_Toma_Fisica_Detalle d2 ON tf2.Id_Toma_Fisica = d2.Id_Toma_Fisica
    WHERE tf2.Fecha > p.Fecha_Inicial
      AND tf2.Id_Empresa = p.Id_Empresa
      AND d2.Id_Producto = p.Id_Producto
    ORDER BY tf2.Fecha
    LIMIT 1
  ),
  Fecha_Final = (
    SELECT tf2.Fecha
    FROM Inv_Toma_Fisica tf2
    INNER JOIN Inv_Toma_Fisica_Detalle d2 ON tf2.Id_Toma_Fisica = d2.Id_Toma_Fisica
    WHERE tf2.Fecha > p.Fecha_Inicial
      AND tf2.Id_Empresa = p.Id_Empresa
      AND d2.Id_Producto = p.Id_Producto
    ORDER BY tf2.Fecha
    LIMIT 1
  );

  OPEN cur;
  read_loop: LOOP
    FETCH cur INTO v_Id_Empresa, v_Id_Producto, v_Fecha_Inicial;
    IF done THEN LEAVE read_loop; END IF;

    SELECT Cantidad_Contada INTO v_ExistenciaEsperada
    FROM tmp_toma_productos
    WHERE Id_Empresa = v_Id_Empresa AND Id_Producto = v_Id_Producto;

    SET done2 = FALSE;
    OPEN cur_mov;
      read_mov: LOOP
        FETCH cur_mov INTO mv_Id, mv_Fecha, mv_Tipo, mv_Cant;
        IF done2 THEN LEAVE read_mov; END IF;

        IF mv_Tipo IN ('02','04') THEN
          SET v_ExistenciaEsperada = v_ExistenciaEsperada + mv_Cant;
        ELSEIF mv_Tipo IN ('01','03') THEN
          SET v_ExistenciaEsperada = v_ExistenciaEsperada - mv_Cant;
        END IF;
      END LOOP;
    CLOSE cur_mov;

    -- Obtener la fecha final y la toma siguiente
    SELECT Fecha_Final, Id_Toma_Fisica_Siguiente
    INTO v_Fecha_Final, v_Id_Toma_Fisica_Siguiente
    FROM tmp_toma_productos
    WHERE Id_Empresa = v_Id_Empresa AND Id_Producto = v_Id_Producto;

    IF v_Id_Toma_Fisica_Siguiente IS NULL THEN
      UPDATE Inv_Producto
      SET Existencia = v_ExistenciaEsperada
      WHERE Id_Producto = v_Id_Producto AND Id_Empresa = v_Id_Empresa;

      INSERT INTO Inv_Existencia_Correccion_Log (
        Id_Empresa, Id_Producto, Existencia_Anterior, Existencia_Correcta, Proceso, Observacion
      )
      VALUES (
        v_Id_Empresa, v_Id_Producto, NULL, v_ExistenciaEsperada,
        CONCAT('Auditoría toma física ID ', p_Id_Toma_Fisica),
        'Actualización directa de existencia'
      );
    ELSE
      UPDATE Inv_Toma_Fisica_Detalle
      SET Cantidad_Actual = v_ExistenciaEsperada,
          Diferencia = Cantidad_Contada - v_ExistenciaEsperada
      WHERE Id_Toma_Fisica = v_Id_Toma_Fisica_Siguiente
        AND Id_Producto = v_Id_Producto;
    END IF;
  END LOOP;
  CLOSE cur;

  DO RELEASE_LOCK('sp_Inv_Auditar_Existencia_TomaFisica_LOCK');
END