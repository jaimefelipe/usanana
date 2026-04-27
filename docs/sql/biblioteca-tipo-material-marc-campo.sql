-- Relaciona tipos de material con etiquetas/campos del diccionario MARC

CREATE TABLE IF NOT EXISTS Bib_Tipo_Material_Marc_Campo (
  Id_Tipo_Material_Marc_Campo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Tipo_Material_Id INT NOT NULL,
  Dic_Campo_Id BIGINT NOT NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bib_tipo_material_marc_campo_empresa
    FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_bib_tipo_material_marc_campo_tipo
    FOREIGN KEY (Tipo_Material_Id) REFERENCES Bib_Tipo_Material(Id_Tipo_Material) ON DELETE CASCADE,
  CONSTRAINT fk_bib_tipo_material_marc_campo_dic
    FOREIGN KEY (Dic_Campo_Id) REFERENCES Bib_Marc_Dic_Campo(Id_Dic_Campo) ON DELETE CASCADE,
  UNIQUE KEY uq_bib_tipo_material_marc_campo (Id_Empresa, Tipo_Material_Id, Dic_Campo_Id)
);
