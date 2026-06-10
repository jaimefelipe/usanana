-- Configuracion financiera para admision y matricula de primer ingreso.
-- Ejecutar una vez en la base academica.

CREATE TABLE IF NOT EXISTS Edu_Admision_Config_Financiera (
  Id_Config_Financiera INT NOT NULL AUTO_INCREMENT,
  Id_Empresa INT NOT NULL,
  Id_Carrera INT NULL,
  Nivel VARCHAR(30) NULL,
  Nombre VARCHAR(160) NOT NULL,
  Moneda VARCHAR(10) NOT NULL DEFAULT 'CRC',
  Cursos_Por_Bloque INT NOT NULL DEFAULT 4,
  Creditos_Por_Curso DECIMAL(10,2) NOT NULL DEFAULT 3,
  Precio_Credito DECIMAL(18,5) NOT NULL DEFAULT 0,
  Precio_Curso DECIMAL(18,5) NOT NULL DEFAULT 0,
  Matricula_Bloque DECIMAL(18,5) NOT NULL DEFAULT 0,
  Medio_Pago_Texto TEXT NULL,
  Bancos_JSON LONGTEXT NULL,
  Notificar_Email VARCHAR(200) NULL,
  Activo TINYINT(1) NOT NULL DEFAULT 1,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Creado_Por VARCHAR(80) NULL,
  Modificado_El DATETIME NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  Modificado_Por VARCHAR(80) NULL,
  PRIMARY KEY (Id_Config_Financiera),
  KEY idx_edu_admision_config_fin_nivel (Id_Empresa, Nivel, Activo),
  KEY idx_edu_admision_config_fin_carrera (Id_Empresa, Id_Carrera, Activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE Edu_Admision_Solicitud
  ADD COLUMN IF NOT EXISTS Id_Admision_Plan_Pago INT NULL AFTER Carta_Admision_URL,
  ADD COLUMN IF NOT EXISTS Monto_Base_Estimado DECIMAL(18,5) NOT NULL DEFAULT 0 AFTER Id_Admision_Plan_Pago,
  ADD COLUMN IF NOT EXISTS Descuento_Estimado DECIMAL(18,5) NOT NULL DEFAULT 0 AFTER Monto_Base_Estimado,
  ADD COLUMN IF NOT EXISTS Total_Estimado DECIMAL(18,5) NOT NULL DEFAULT 0 AFTER Descuento_Estimado,
  ADD COLUMN IF NOT EXISTS Numero_Cuotas_Estimado INT NOT NULL DEFAULT 1 AFTER Total_Estimado,
  ADD COLUMN IF NOT EXISTS Cuota_Estimada DECIMAL(18,5) NOT NULL DEFAULT 0 AFTER Numero_Cuotas_Estimado,
  ADD COLUMN IF NOT EXISTS Calculo_Pago_JSON LONGTEXT NULL AFTER Cuota_Estimada,
  ADD COLUMN IF NOT EXISTS Pago_Info_JSON LONGTEXT NULL AFTER Calculo_Pago_JSON,
  ADD COLUMN IF NOT EXISTS Fecha_Ultima_Actualizacion_Aspirante DATETIME NULL AFTER Pago_Info_JSON,
  ADD COLUMN IF NOT EXISTS Revisado_Actualizacion_El DATETIME NULL AFTER Fecha_Ultima_Actualizacion_Aspirante;

ALTER TABLE Edu_Admision_Orden_Pago
  ADD COLUMN IF NOT EXISTS Numero_Cuotas INT NOT NULL DEFAULT 1 AFTER Total,
  ADD COLUMN IF NOT EXISTS Cuota_Monto DECIMAL(18,5) NOT NULL DEFAULT 0 AFTER Numero_Cuotas,
  ADD COLUMN IF NOT EXISTS Calculo_JSON LONGTEXT NULL AFTER Medio_Pago,
  ADD COLUMN IF NOT EXISTS Pago_Info_JSON LONGTEXT NULL AFTER Calculo_JSON;

INSERT INTO Edu_Admision_Config_Financiera (
  Id_Empresa,
  Nivel,
  Nombre,
  Moneda,
  Cursos_Por_Bloque,
  Creditos_Por_Curso,
  Precio_Credito,
  Precio_Curso,
  Matricula_Bloque,
  Medio_Pago_Texto,
  Bancos_JSON,
  Notificar_Email,
  Activo,
  Creado_Por
)
SELECT
  1,
  n.Nivel,
  CONCAT('Configuracion admision nivel ', n.Nivel),
  'CRC',
  4,
  3,
  0,
  0,
  0,
  'Realice el pago por transferencia o deposito y cargue el comprobante en el portal de seguimiento.',
  JSON_ARRAY(
    JSON_OBJECT('banco','Configurar banco','cuenta','Configurar cuenta','iban','Configurar IBAN','moneda','CRC','titular','Universidad Santa Ana San Jose')
  ),
  'admisiones@usantana.com',
  1,
  'migration'
FROM (
  SELECT DISTINCT Nivel
  FROM Edu_Carrera
  WHERE Id_Empresa = 1
    AND Estado = 1
    AND Nivel IS NOT NULL
    AND TRIM(Nivel) <> ''
) n
WHERE NOT EXISTS (
  SELECT 1
  FROM Edu_Admision_Config_Financiera f
  WHERE f.Id_Empresa = 1
    AND f.Id_Carrera IS NULL
    AND f.Nivel = n.Nivel
);

-- Importante:
-- Configure Precio_Credito o Precio_Curso y Matricula_Bloque por nivel/carrera antes de publicar montos reales.
-- Si Id_Carrera tiene valor, esa configuracion tiene prioridad sobre la configuracion por Nivel.

