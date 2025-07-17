CREATE DEFINER=`toxoqfbh_jbrenes`@`localhost` PROCEDURE `sp_Inv_Recalcular_Existencias_Desde_Toma_Fisica`(
    IN p_Id_Toma_Fisica INT
)
BEGIN
    DECLARE v_Fecha_Toma DATETIME;

    -- 1. Obtener la fecha y hora de la toma física
    SELECT Creado_El INTO v_Fecha_Toma
    FROM Inv_Toma_Fisica
    WHERE Id_Toma_Fisica = p_Id_Toma_Fisica;

    -- 2. Crear tabla temporal con cálculos
    DROP TEMPORARY TABLE IF EXISTS tmp_existencias_calculadas;

    CREATE TEMPORARY TABLE tmp_existencias_calculadas AS
    SELECT 
        d.Id_Producto,
        d.Cantidad_Contada,

        -- Entradas posteriores a la toma
        IFNULL((
            SELECT SUM(md.Cantidad)
            FROM Inv_Movimiento m
            JOIN Inv_Movimiento_Detalle md ON m.Id_Movimiento = md.Id_Movimiento
            WHERE m.Estado = 1 
              AND md.Id_Producto = d.Id_Producto
              AND m.Tipo_Movimiento IN ('02', '04') -- Entradas
              AND m.Creado_El > v_Fecha_Toma
        ), 0) AS Entradas_Posteriores,

        -- Salidas posteriores a la toma
        IFNULL((
            SELECT SUM(md.Cantidad)
            FROM Inv_Movimiento m
            JOIN Inv_Movimiento_Detalle md ON m.Id_Movimiento = md.Id_Movimiento
            WHERE m.Estado = 1 
              AND md.Id_Producto = d.Id_Producto
              AND m.Tipo_Movimiento IN ('01', '03') -- Salidas
              AND m.Creado_El > v_Fecha_Toma
        ), 0) AS Salidas_Posteriores,

        -- Cálculo final
        d.Cantidad_Contada 
            + IFNULL((
                SELECT SUM(md.Cantidad)
                FROM Inv_Movimiento m
                JOIN Inv_Movimiento_Detalle md ON m.Id_Movimiento = md.Id_Movimiento
                WHERE m.Estado = 1 
                  AND md.Id_Producto = d.Id_Producto
                  AND m.Tipo_Movimiento IN ('02', '04')
                  AND m.Creado_El > v_Fecha_Toma
            ), 0)
            - IFNULL((
                SELECT SUM(md.Cantidad)
                FROM Inv_Movimiento m
                JOIN Inv_Movimiento_Detalle md ON m.Id_Movimiento = md.Id_Movimiento
                WHERE m.Estado = 1 
                  AND md.Id_Producto = d.Id_Producto
                  AND m.Tipo_Movimiento IN ('01', '03')
                  AND m.Creado_El > v_Fecha_Toma
            ), 0) AS Existencia_Calculada

    FROM Inv_Toma_Fisica_Detalle d
    WHERE d.Id_Toma_Fisica = p_Id_Toma_Fisica
    GROUP BY d.Id_Producto;

    -- 3. Actualizar Inv_Producto con existencia calculada
    
    SELECT p.Id_Producto, p.Existencia, t.Existencia_Calculada
	FROM Inv_Producto p
	JOIN tmp_existencias_calculadas t ON p.Id_Producto = t.Id_Producto;
    
    
	UPDATE Inv_Producto p
	JOIN tmp_existencias_calculadas t ON p.Id_Producto = t.Id_Producto
	SET p.Existencia = t.Existencia_Calculada + 0;
    


    -- 4. Opcional: retornar resumen de actualización
    SELECT 
        p.Id_Producto,
        t.Cantidad_Contada,
        t.Entradas_Posteriores,
        t.Salidas_Posteriores,
        t.Existencia_Calculada AS Existencia_Actualizada,
        p.Existencia
    FROM Inv_Producto p
    JOIN tmp_existencias_calculadas t ON p.Id_Producto = t.Id_Producto
    ORDER BY p.Id_Producto;
END