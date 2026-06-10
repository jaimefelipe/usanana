CREATE TABLE IF NOT EXISTS Lms_EntregaActividad (
  Id_Entrega INT NOT NULL AUTO_INCREMENT,
  Id_Empresa INT NOT NULL,
  Id_Actividad INT NOT NULL,
  Id_Usuario INT NOT NULL,
  Url VARCHAR(500) NULL,
  Nota DECIMAL(5,2) NULL,
  Comentario_Docente TEXT NULL,
  Creado_Por VARCHAR(100) NULL,
  Creado_El DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  Modificado_Por VARCHAR(100) NULL,
  Modificado_El DATETIME NULL,
  PRIMARY KEY (Id_Entrega),
  INDEX IX_Lms_EntregaActividad_Actividad (Id_Empresa, Id_Actividad),
  INDEX IX_Lms_EntregaActividad_Usuario (Id_Empresa, Id_Usuario)
);
