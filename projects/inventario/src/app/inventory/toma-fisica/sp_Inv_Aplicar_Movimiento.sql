CREATE DEFINER=`toxoqfbh_jbrenes`@`localhost` PROCEDURE `sp_Inv_Aplicar_Movimiento`(IN p_Id_Movimiento INT)
BEGIN
	DECLARE v_Id_Empresa Int;
	DECLARE v_Tipo_Movimiento varchar(2);
	DECLARE v_Moneda VARCHAR(3);
	DECLARE v_Tipo_Cambio NUMERIC(18,5);
	DECLARE v_Estado BIT;
	DECLARE v_Id_Producto INT;
	DECLARE v_Cantidad INT;
	DECLARE v_Precio NUMERIC(18,5);
	DECLARE v_Existencia NUMERIC(18,5);
	DECLARE v_Costo_Promedio NUMERIC(18,5);
	DECLARE v_Ultimo_Costo NUMERIC(18,5);
	DECLARE v_Categoria INT;
	DECLARE v_Nueva_Existencia NUMERIC(18,5);
	DECLARE v_Nuevo_Costo_Promedio NUMERIC(18,5);
	DECLARE v_Nuevo_Ultimo_Costo NUMERIC(18,5);
	DECLARE v_Codigo_Proveedor_Producto VARCHAR(100);
	DECLARE v_Codigo_Proveedor_Factura VARCHAR(100);
	DECLARE v_Porcentaje_Utilidad VARCHAR(100);
	DECLARE v_Nuevo_Precio NUMERIC(18,5);
	DECLARE v_Precio_Calculado NUMERIC(18,5);
	DECLARE v_Calcular_Precio BIT;
	DECLARE v_Id_Producto_Relacionado INT;
	DECLARE v_Cantidad_Relacionada NUMERIC(18,5);
	DECLARE v_Id_Factura_Detalle INT;
    
    DECLARE finished INT DEFAULT 0;
	DECLARE cur CURSOR FOR
		SELECT Id_Producto, Cantidad, Precio, Codigo_Proveedor, Id_Movimiento_Detalle
		FROM Inv_Movimiento_Detalle WHERE Id_Movimiento = p_Id_Movimiento;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;

	CREATE TEMPORARY TABLE IF NOT EXISTS tmp_existencia_producto (
		Id_Producto INT PRIMARY KEY,
		Existencia_Actual DECIMAL(18,5)
	);

	SELECT Id_Empresa, Tipo_Movimiento, Moneda, Tipo_Cambio, Estado
	INTO v_Id_Empresa, v_Tipo_Movimiento, v_Moneda, v_Tipo_Cambio, v_Estado
	FROM Inv_Movimiento WHERE Id_Movimiento = p_Id_Movimiento;

	IF v_Estado = 0 THEN
		SELECT IFNULL(Valor, 0) INTO v_Calcular_Precio 
		FROM Gen_Parametros_Compania 
		WHERE Id_Empresa = v_Id_Empresa AND Parametro = 'Inv_Calculo_Precio_Compra';

		OPEN cur;
		WHILE finished = 0 DO
			FETCH cur INTO v_Id_Producto, v_Cantidad, v_Precio, v_Codigo_Proveedor_Factura, v_Id_Factura_Detalle;

			SELECT IFNULL(Id_Producto_Relacionado,0), IFNULL(Cantidad_Relacionada,0)
			INTO v_Id_Producto_Relacionado, v_Cantidad_Relacionada
			FROM Inv_Producto WHERE Id_Producto = v_Id_Producto;

			IF v_Id_Producto_Relacionado != 0 THEN
				SET v_Id_Producto = v_Id_Producto_Relacionado;
				SET v_Cantidad = v_Cantidad * v_Cantidad_Relacionada;
			END IF;

			SELECT Categoria, IFNULL(Existencia,0), IFNULL(Ultimo_Costo,0), IFNULL(Costo_Promedio,0), Codigo_Proveedor, IFNULL(Precio,0)
			INTO v_Categoria, v_Existencia, v_Ultimo_Costo, v_Costo_Promedio, v_Codigo_Proveedor_Producto, v_Nuevo_Precio
			FROM Inv_Producto WHERE Id_Producto = v_Id_Producto;

			-- Obtener existencia encadenada (preferir la temporal)
			SELECT Existencia_Actual INTO v_Existencia
			FROM tmp_existencia_producto WHERE Id_Producto = v_Id_Producto
			LIMIT 1;
			IF v_Existencia IS NULL THEN
				SELECT IFNULL(Existencia,0) INTO v_Existencia FROM Inv_Producto WHERE Id_Producto = v_Id_Producto;
			END IF;

			IF v_Tipo_Movimiento IN ('01','03') THEN
				SET v_Nueva_Existencia = v_Existencia - v_Cantidad;
				SET v_Nuevo_Costo_Promedio = v_Costo_Promedio;
				SET v_Nuevo_Ultimo_Costo = v_Ultimo_Costo;
			ELSE
				SET v_Nueva_Existencia = v_Existencia + v_Cantidad;
				SET v_Nuevo_Costo_Promedio = ((v_Existencia * v_Costo_Promedio) + (v_Precio * v_Cantidad)) / v_Nueva_Existencia;
				SET v_Nuevo_Ultimo_Costo = v_Precio;
			END IF;

			IF v_Calcular_Precio = 1 THEN
				SELECT IFNULL(Utilidad,0) INTO v_Porcentaje_Utilidad FROM Inv_Categoria WHERE Id_Categoria = v_Categoria;
				SET v_Precio_Calculado = v_Nuevo_Costo_Promedio + ((v_Nuevo_Costo_Promedio * v_Porcentaje_Utilidad) / 100);
				IF v_Precio_Calculado > 0 THEN
					SET v_Nuevo_Precio = v_Precio_Calculado;
				END IF;
			END IF;

			IF v_Tipo_Movimiento IN ('01','03') THEN
				UPDATE Inv_Producto SET Existencia = v_Nueva_Existencia WHERE Id_Producto = v_Id_Producto;
			ELSE
				UPDATE Inv_Producto SET Existencia = v_Nueva_Existencia,
					Ultimo_Costo = v_Nuevo_Ultimo_Costo,
					Costo_Promedio = v_Nuevo_Costo_Promedio,
					Precio = v_Nuevo_Precio
				WHERE Id_Producto = v_Id_Producto;
			END IF;

			IF v_Codigo_Proveedor_Producto = '' AND v_Codigo_Proveedor_Factura <> '' THEN
				UPDATE Inv_Producto SET Codigo_Proveedor = v_Codigo_Proveedor_Factura WHERE Id_Producto = v_Id_Producto;
			END IF;

			-- Actualizar existencias en detalle y en tabla temporal
			UPDATE Inv_Movimiento_Detalle 
			SET Existencia_Anterior = v_Existencia, Nueva_Existencia = v_Nueva_Existencia 
			WHERE Id_Movimiento_Detalle = v_Id_Factura_Detalle;

			REPLACE INTO tmp_existencia_producto (Id_Producto, Existencia_Actual)
			VALUES (v_Id_Producto, v_Nueva_Existencia);
		END WHILE;
		CLOSE cur;

		UPDATE Inv_Movimiento SET Estado = 1 WHERE Id_Movimiento = p_Id_Movimiento;
	END IF;
END