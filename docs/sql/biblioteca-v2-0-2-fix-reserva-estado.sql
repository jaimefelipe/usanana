-- Biblioteca USASJ v2.1 - Fix critico: ck_reserva_estado bloqueaba TODA reserva
-- Causa raiz: el codigo (biblioteca-data.service.ts, campus libro-detalle.service.ts,
-- campus mi-biblioteca.service.ts) inserta/lee Bib_Reserva.Estado en 'En espera' y
-- 'Disponible', pero el CHECK original solo permitia
-- ('activa','atendida','cancelada','liberada'). Resultado: cada intento de reserva
-- (Biblioteca y Campus) fallaba en produccion con
-- "CONSTRAINT `ck_reserva_estado` failed for `usanwoig_santana`.`Bib_Reserva`".
-- Ejecutar una vez en MySQL/MariaDB por ambiente. Idempotente (verifica antes de tocar).

DROP PROCEDURE IF EXISTS sp_fix_ck_reserva_estado;

DELIMITER //
CREATE PROCEDURE sp_fix_ck_reserva_estado()
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'Bib_Reserva'
      AND CONSTRAINT_NAME = 'ck_reserva_estado'
  ) THEN
    ALTER TABLE Bib_Reserva DROP CONSTRAINT ck_reserva_estado;
  END IF;

  ALTER TABLE Bib_Reserva
    ADD CONSTRAINT ck_reserva_estado CHECK (
      LOWER(Estado) IN ('activa','en espera','disponible','atendida','cancelada','liberada')
    );
END //
DELIMITER ;

CALL sp_fix_ck_reserva_estado();
DROP PROCEDURE IF EXISTS sp_fix_ck_reserva_estado;
