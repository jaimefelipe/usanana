CREATE DEFINER=`toxoqfbh_jbrenes`@`localhost` PROCEDURE `sp_Inv_Recalculo_Precio_Costo_Existencia`(IN p_Id_Empresa INT)
BEGIN
DECLARE v_Id_Producto Int;
    Declare v_SKU varchar(50);
    Declare v_Descripcion VARCHAR(200);
    Declare v_Id_Categoria Int;
    Declare v_Precio NUMERIC(18,5);
    Declare v_Existencia Numeric(18,5);
    Declare v_Ultimo_Costo Numeric(18,5);
    Declare v_Costo_Promedio NUMERIC(18,5);

    Declare v_Porcentaje_Utilidad NUMERIC(18,5);
    
    Declare v_String VARCHAR(2000);
    Declare v_String1 VARCHAR(2000);

    -- Factua de Compra
    Declare v_Tipo_Movimiento Varchar(3);
    Declare v_Cantidad_Movimieto NUMERIC(18,5);
    Declare v_Precio_Movimiento NUMERIC(18,5);
    Declare v_Creado_El DATETIME;

    -- Calculos 
    Declare v_Existencias_Nuevo  NUMERIC(18,5);
    Declare v_Precio_Nuevo  NUMERIC(18,5);
    Declare v_Ultimo_Costo_Nuevo  NUMERIC(18,5);
    Declare v_Ultimo_Costo_Anterior  NUMERIC(18,5);
    Declare v_Costo_Promedio_Nuevo  NUMERIC(18,5);
    
    DECLARE finished INT DEFAULT 0;
    DECLARE db_cursor CURSOR FOR
    SELECT Id_Producto,SKU,Descripcion,Categoria, Precio,Ultimo_Costo,Costo_Promedio,Existencia
	FROM Inv_Producto where Id_Empresa = p_Id_Empresa;
    
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000'  
	SET finished = 1;  
	DECLARE CONTINUE HANDLER FOR SQLSTATE '23000'  
    SET finished = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND 
    SET finished = 1;
    
    OPEN db_cursor;
    -- inicio del 
    lbl: LOOP 
        IF finished = 1 THEN  
            LEAVE lbl;  
        END IF;  
        FETCH db_cursor INTO v_Id_Producto, v_SKU, v_Descripcion,v_Id_Categoria, v_Precio, v_Ultimo_Costo, v_Costo_Promedio,v_Existencia;
        IF NOT finished = 1 THEN
            set v_Cantidad_Movimieto = 0;
            set v_Ultimo_Costo_Anterior = 0 ;
			set v_Existencias_Nuevo = 0;
            if v_Existencia is NUll THEN
				set v_Existencia = 0;
			END IF;
			if v_Costo_Promedio is null THEN
				set v_Costo_Promedio = 0;
			end IF;
            
            -- Obtener el Procentaje de Utilidad que le corresponde al producto
			-- print 'Categoria'
			-- print v_Id_Categoria;
			Select Utilidad into v_Porcentaje_Utilidad  From Inv_Categoria where Id_Categoria = v_Id_Categoria;
			-- print v_Porcentaje_Utilidad

			-- print '***************************************';
			Set v_String = Concat('Procesando Producto: ',v_Id_Producto,' - SKU:',v_SKU,' - Desc:',v_Descripcion,' - Categoria:',v_Id_Categoria);
			-- Leer las facturas de Compra correspondientes a el producto
			-- Select * from Com_Factura_Detalle where Id_Producto = v_Id_Producto or SKU = v_SKU or Descripcion = v_Descripcion order by Creado_El ASC;
			-- Crear el Cursor para recorrer los datos y Calcular Precio, Costo y Existencias.
			
			BLOCK2: BEGIN
				DECLARE finished1 INT DEFAULT 0;
				DECLARE db_cursor_Inv_Movimientos CURSOR FOR
				SELECT Tipo, Cantidad, Precio, Creado_el
				FROM (
					SELECT 'Com' AS Tipo, COALESCE(Com.Cantidad, 0) AS Cantidad, COALESCE(Com.Precio, 0) AS Precio, COALESCE(Com.Creado_El, '') AS Creado_el
					FROM (SELECT 1) AS Dummy
					LEFT JOIN Com_Factura_Detalle AS Com ON Com.Id_Producto = v_Id_Producto

					UNION ALL

					SELECT 'Ven' AS Tipo, COALESCE(Ven.Cantidad, 0) AS Cantidad, COALESCE(Ven.Precio, 0) AS Precio, COALESCE(Ven.Creado_El, '') AS Creado_el
					FROM (SELECT 1) AS Dummy
					LEFT JOIN Ven_Factura_Detalle AS Ven ON Ven.Id_Producto = v_Id_Producto
				) AS Resultado
				order By Creado_El Asc;
				
				DECLARE CONTINUE HANDLER FOR SQLSTATE '02000'  
				SET finished1 = 1;  
				DECLARE CONTINUE HANDLER FOR SQLSTATE '23000'  
				SET finished1 = 1;
				DECLARE CONTINUE HANDLER FOR NOT FOUND 
				SET finished1 = 1;
            
				OPEN db_cursor_Inv_Movimientos;
				lbl1: LOOP 
					IF finished1 = 1 THEN  
						LEAVE lbl1;  
					END IF;  
					FETCH db_cursor_Inv_Movimientos INTO v_Tipo_Movimiento,v_Cantidad_Movimieto,v_Precio_Movimiento,v_Creado_El;
                    IF NOT finished1 = 1 THEN
                        Set v_String1 = Concat('Movimeinto: Tipo ',v_Tipo_Movimiento,' - Cantidad: ',v_Cantidad_Movimieto,' - Precio: ',v_Precio_Movimiento,' - Fecha: ',v_Creado_El);
						-- select v_String1;
						-- Print v_String1;
						if v_Tipo_Movimiento = 'Com' THEN
							-- print 'Compra'
							if v_Ultimo_Costo_Anterior = 0 THEN
								set v_Ultimo_Costo_Anterior = v_Precio_Movimiento;
                            END IF;
                            Set v_Precio_Nuevo = v_Precio_Movimiento;
							Set v_Ultimo_Costo_Nuevo = v_Precio_Movimiento;
							
							-- Calculo del Costo Promedio
							SET v_Costo_Promedio_Nuevo = ((v_Existencias_Nuevo * v_Ultimo_Costo_Anterior) + (v_Precio_Movimiento * v_Cantidad_Movimieto) ) /  (v_Existencias_Nuevo + v_Cantidad_Movimieto);
							
                            Set v_Existencias_Nuevo = v_Existencias_Nuevo + v_Cantidad_Movimieto;
							
                            set v_Ultimo_Costo_Anterior = v_Costo_Promedio_Nuevo;

							-- Calculo del Nuevo Precio
							set v_Precio_Nuevo = Round(v_Costo_Promedio_Nuevo + ((v_Costo_Promedio_Nuevo * v_Porcentaje_Utilidad) / 100 ),2); 
							-- print 'Precio'
							-- print v_Precio_Nuevo;
							if v_Precio_Nuevo = 0 THEN
								-- print 'Precio Calculado en Cero'
								-- print v_Precio_Nuevo
								-- print 'v_Cantidad_Movimieto'
								-- print v_Cantidad_Movimieto
								set v_Precio_Nuevo = v_Precio;
                            END IF;
						else
							-- select concat('Exitencia:',v_Existencias_Nuevo,'Monto:',v_Existencias_Nuevo);
                            Set v_Existencias_Nuevo = v_Existencias_Nuevo - v_Cantidad_Movimieto;
                            -- select v_Existencias_Nuevo;
                        END IF;
						-- set v_String = Concat('Movimiento',v_Tipo_Movimiento,'-',v_Cantidad_Movimieto,'-',v_Precio_Movimiento);
						-- print v_String;
					END IF;  
				END LOOP; 
				CLOSE db_cursor_Inv_Movimientos; 
            END BLOCK2;
            -- select v_Existencias_Nuevo;
            -- Recorrer los movimientos de inventario que no tienen un moviemiento de factura asociado.
            -- Cantidad que suma del movimiento de inventarios
            SELECT Sum(Cantidad) into v_Cantidad_Movimieto FROM Inv_Movimiento_Detalle
			inner join Inv_Movimiento on Inv_Movimiento_Detalle.Id_Movimiento = Inv_Movimiento.Id_Movimiento
			where Inv_Movimiento_Detalle.Id_Producto = v_Id_Producto and (Inv_Movimiento.Tipo_Movimiento = '02' or Inv_Movimiento.Tipo_Movimiento = '04') and Inv_Movimiento.Sistema_Origen = 'In'; 
            Set v_Existencias_Nuevo = v_Existencias_Nuevo + v_Cantidad_Movimieto;
            -- select v_Cantidad_Movimieto;
            -- select v_Existencias_Nuevo;
            -- Cantidad que suma del movimiento de inventarios
            SELECT Sum(Cantidad) into v_Cantidad_Movimieto FROM Inv_Movimiento_Detalle
			inner join Inv_Movimiento on Inv_Movimiento_Detalle.Id_Movimiento = Inv_Movimiento.Id_Movimiento
			where Inv_Movimiento_Detalle.Id_Producto = v_Id_Producto and (Inv_Movimiento.Tipo_Movimiento = '01' or Inv_Movimiento.Tipo_Movimiento = '03') and Inv_Movimiento.Sistema_Origen = 'In'; 
            -- select v_Existencias_Nuevo;
            Set v_Existencias_Nuevo = v_Existencias_Nuevo - v_Cantidad_Movimieto;
            -- select v_Cantidad_Movimieto;
            -- select v_Existencias_Nuevo;
            
            -- Verificar si la existencia es diferente.
			if v_Existencia != v_Existencias_Nuevo THEN
				Set v_String1 = Concat(v_Id_Producto,' - ',v_SKU,'Existencia DB',v_Existencia,' Existencia Calculada',v_Existencias_Nuevo);
				update Inv_Producto set Existencia = v_Existencias_Nuevo where Id_Producto = v_Id_Producto;
			   -- end
			end IF;
			-- Verificar el el Ultimo Costo es diferente
			if v_Ultimo_Costo != v_Ultimo_Costo_Nuevo THEN
				if v_Ultimo_Costo_Nuevo > 0 THEN
					Set v_String1 = Concat(v_Id_Producto,' - ',v_SKU,'Ultimo Costo DB',v_Ultimo_Costo,' Ultimo Costo Calculada',v_Ultimo_Costo_Nuevo);
				   -- update Inv_Producto set Ultimo_Costo = v_Ultimo_Costo_Nuevo where Id_Producto = v_Id_Producto;
				end IF;
			END IF;
			-- Verificar si el Costo promedio es Diferente
			if v_Costo_Promedio_Nuevo != v_Costo_Promedio THEN
				if v_Costo_Promedio_Nuevo > 0 THEN
					Set v_String1 = Concat(v_Id_Producto,' - ',v_SKU,'Costo Promedio DB',v_Costo_Promedio,' Costo promedio Calculada',v_Costo_Promedio_Nuevo);
					-- update Inv_Producto set Costo_Promedio = v_Costo_Promedio_Nuevo where Id_Producto = v_Id_Producto;
				end IF;
			END IF;
			-- Verificar si el precio es diferente
			if v_Precio_Nuevo != v_Precio THEN
				if v_Precio_Nuevo > 0 THEN
					Set v_String1 = Concat(v_Id_Producto,' - ',v_SKU,'Precio DB',v_Precio,' Precio Calculada',v_Precio_Nuevo);
					-- update Inv_Producto set Precio = v_Precio_Nuevo where Id_Producto = v_Id_Producto;
				END IF;
			END IF;
        END IF;  
	END LOOP; 
    CLOSE db_cursor;  
END