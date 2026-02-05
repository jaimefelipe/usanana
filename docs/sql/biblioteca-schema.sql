-- Esquema base Biblioteca Universitaria (MySQL)
-- Incluye: gestion de ejemplares, catalogo avanzado, circulacion avanzada, integracion institucional
-- Convenciones: tablas prefijadas con "Bib_", PKs Id_<Tabla>, Id_Empresa como FK a Gen_Empresa
-- Nota: ejecutar docs/sql/biblioteca-auditoria-alter.sql para agregar campos de auditoria si se requiere.

SET FOREIGN_KEY_CHECKS = 0;

-- Catalogo avanzado
CREATE TABLE Bib_Tipo_Material (
  Id_Tipo_Material INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(80) NOT NULL, -- libro, revista, tesis, publicacion, multimedia
  Descripcion VARCHAR(200),
  CONSTRAINT fk_tipo_material_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_tipo_material (Id_Empresa, Nombre)
);

CREATE TABLE Bib_Autor (
  Id_Autor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(200) NOT NULL,
  Nacionalidad VARCHAR(120),
  Fecha_Nacimiento DATE,
  CONSTRAINT fk_autor_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_autor_empresa_nombre (Id_Empresa, Nombre)
);

CREATE TABLE Bib_Editorial (
  Id_Editorial INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(200) NOT NULL,
  Sitio_Web VARCHAR(200),
  CONSTRAINT fk_editorial_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_editorial_empresa_nombre (Id_Empresa, Nombre)
);

CREATE TABLE Bib_Categoria (
  Id_Categoria INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(150) NOT NULL,
  Codigo VARCHAR(50),
  CONSTRAINT fk_categoria_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_categoria_empresa_nombre (Id_Empresa, Nombre),
  UNIQUE KEY uq_categoria_empresa_codigo (Id_Empresa, Codigo)
);

CREATE TABLE Bib_Libro (
  Id_Libro INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Id_Tipo_Material INT NOT NULL,
  Titulo VARCHAR(300) NOT NULL,
  Subtitulo VARCHAR(300),
  ISBN VARCHAR(20),
  ISSN VARCHAR(20),
  DOI VARCHAR(120),
  Editorial_Id INT,
  Categoria_Id INT,
  Idioma VARCHAR(50),
  Anio_Publicacion SMALLINT,
  Edicion VARCHAR(80),
  Descripcion TEXT,
  Palabras_Clave TEXT,
  URL_Publica VARCHAR(300),
  CONSTRAINT fk_libro_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_libro_tipo FOREIGN KEY (Id_Tipo_Material) REFERENCES Bib_Tipo_Material(Id_Tipo_Material),
  CONSTRAINT fk_libro_editorial FOREIGN KEY (Editorial_Id) REFERENCES Bib_Editorial(Id_Editorial),
  CONSTRAINT fk_libro_categoria FOREIGN KEY (Categoria_Id) REFERENCES Bib_Categoria(Id_Categoria),
  UNIQUE KEY uq_libro_empresa_isbn (Id_Empresa, ISBN)
);

CREATE TABLE Bib_Libro_Autor (
  Id_Libro_Autor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Autor_Id INT NOT NULL,
  Rol VARCHAR(50), -- autor, editor, traductor
  CONSTRAINT fk_libro_autor_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_libro_autor_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE,
  CONSTRAINT fk_libro_autor_autor FOREIGN KEY (Autor_Id) REFERENCES Bib_Autor(Id_Autor) ON DELETE CASCADE,
  UNIQUE KEY uq_libro_autor (Id_Empresa, Libro_Id, Autor_Id, Rol)
);

CREATE TABLE Bib_Tesis (
  Id_Tesis INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Universidad VARCHAR(200),
  Facultad VARCHAR(200),
  Carrera VARCHAR(200),
  Tutor VARCHAR(200),
  Autor_Institucional VARCHAR(200),
  Fecha_Defensa DATE,
  CONSTRAINT fk_tesis_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_tesis_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE
);

CREATE TABLE Bib_Serial (
  Id_Serial INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Frecuencia VARCHAR(50), -- mensual, trimestral
  CONSTRAINT fk_serial_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_serial_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE
);

-- Gestion de ejemplares
CREATE TABLE Bib_Ejemplar (
  Id_Ejemplar INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Codigo_Barra VARCHAR(100),
  Ubicacion VARCHAR(200),
  Sede VARCHAR(120),
  Tipo_Soporte VARCHAR(30) NOT NULL DEFAULT 'fisico', -- fisico/digital
  Estado VARCHAR(20) NOT NULL DEFAULT 'disponible',
  Inventario_Tag VARCHAR(100),
  URL_Archivo VARCHAR(300),
  CONSTRAINT fk_ejemplar_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_ejemplar_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE,
  UNIQUE KEY uq_ejemplar_empresa_codigo (Id_Empresa, Codigo_Barra),
  CONSTRAINT ck_ejemplar_estado CHECK (Estado IN ('disponible','prestado','reservado','perdido','mantenimiento'))
);

CREATE INDEX ix_ejemplar_estado ON Bib_Ejemplar(Estado);
CREATE INDEX ix_ejemplar_libro ON Bib_Ejemplar(Libro_Id);

-- Usuarios biblioteca (integracion institucional)
CREATE TABLE Bib_Usuario_Biblioteca (
  Id_Usuario_Biblioteca INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Id_Persona INT,
  Id_Usuario INT,
  Codigo_Universitario VARCHAR(50),
  Nombre VARCHAR(200) NOT NULL,
  Email VARCHAR(200),
  Telefono VARCHAR(30),
  Tipo_Usuario VARCHAR(30) NOT NULL DEFAULT 'alumno', -- alumno, docente, administrativo, externo
  Bloqueado TINYINT(1) NOT NULL DEFAULT 0,
  Multa_Acumulada DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_usuario_biblioteca_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_usuario_biblioteca_persona FOREIGN KEY (Id_Persona) REFERENCES Gen_Persona(Id_Persona),
  CONSTRAINT fk_usuario_biblioteca_usuario FOREIGN KEY (Id_Usuario) REFERENCES Seg_Usuario(Id_Usuario),
  UNIQUE KEY uq_usuario_biblioteca_empresa_email (Id_Empresa, Email)
);

-- Adquisiciones
CREATE TABLE Bib_Proveedor (
  Id_Proveedor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(200) NOT NULL,
  Contacto VARCHAR(200),
  Telefono VARCHAR(30),
  Email VARCHAR(200),
  Direccion VARCHAR(250),
  Estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  CONSTRAINT fk_proveedor_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_proveedor_empresa_nombre (Id_Empresa, Nombre)
);

CREATE TABLE Bib_Presupuesto (
  Id_Presupuesto INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(200) NOT NULL,
  Anio INT NOT NULL,
  Monto DECIMAL(12,2) NOT NULL DEFAULT 0,
  Saldo DECIMAL(12,2) NOT NULL DEFAULT 0,
  Estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  CONSTRAINT fk_presupuesto_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_presupuesto_empresa_nombre (Id_Empresa, Nombre, Anio)
);

CREATE TABLE Bib_Orden_Compra (
  Id_Orden_Compra INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Proveedor_Id INT NOT NULL,
  Presupuesto_Id INT,
  Fecha DATE NOT NULL,
  Estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  Total DECIMAL(12,2) NOT NULL DEFAULT 0,
  Observaciones TEXT,
  CONSTRAINT fk_orden_compra_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_orden_compra_proveedor FOREIGN KEY (Proveedor_Id) REFERENCES Bib_Proveedor(Id_Proveedor),
  CONSTRAINT fk_orden_compra_presupuesto FOREIGN KEY (Presupuesto_Id) REFERENCES Bib_Presupuesto(Id_Presupuesto) ON DELETE SET NULL
);

CREATE TABLE Bib_Orden_Compra_Detalle (
  Id_Orden_Compra_Detalle INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Orden_Compra_Id INT NOT NULL,
  Descripcion VARCHAR(300) NOT NULL,
  Cantidad INT NOT NULL DEFAULT 1,
  Costo_Unitario DECIMAL(12,2) NOT NULL DEFAULT 0,
  Subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_orden_compra_detalle_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_orden_compra_detalle_orden FOREIGN KEY (Orden_Compra_Id) REFERENCES Bib_Orden_Compra(Id_Orden_Compra) ON DELETE CASCADE
);

CREATE TABLE Bib_Factura_Compra (
  Id_Factura_Compra INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Orden_Compra_Id INT,
  Proveedor_Id INT NOT NULL,
  Numero VARCHAR(60) NOT NULL,
  Fecha DATE NOT NULL,
  Total DECIMAL(12,2) NOT NULL DEFAULT 0,
  Estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_factura_compra_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_factura_compra_orden FOREIGN KEY (Orden_Compra_Id) REFERENCES Bib_Orden_Compra(Id_Orden_Compra) ON DELETE SET NULL,
  CONSTRAINT fk_factura_compra_proveedor FOREIGN KEY (Proveedor_Id) REFERENCES Bib_Proveedor(Id_Proveedor),
  UNIQUE KEY uq_factura_compra_numero (Id_Empresa, Numero)
);

CREATE TABLE Bib_Cotizacion (
  Id_Cotizacion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Proveedor_Id INT NOT NULL,
  Descripcion VARCHAR(300) NOT NULL,
  Fecha DATE NOT NULL,
  Total DECIMAL(12,2) NOT NULL DEFAULT 0,
  Estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_cotizacion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_cotizacion_proveedor FOREIGN KEY (Proveedor_Id) REFERENCES Bib_Proveedor(Id_Proveedor)
);

-- Sedes e integraciones
CREATE TABLE Bib_Sede (
  Id_Sede INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(200) NOT NULL,
  Codigo VARCHAR(50),
  Direccion VARCHAR(250),
  Telefono VARCHAR(30),
  Estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  CONSTRAINT fk_sede_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_sede_empresa_nombre (Id_Empresa, Nombre),
  UNIQUE KEY uq_sede_empresa_codigo (Id_Empresa, Codigo)
);

CREATE TABLE Bib_Integracion (
  Id_Integracion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Tipo VARCHAR(100) NOT NULL,
  Endpoint VARCHAR(300),
  Usuario VARCHAR(120),
  Clave VARCHAR(120),
  Puerto INT,
  Estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  Notas TEXT,
  CONSTRAINT fk_integracion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_integracion_empresa_tipo (Id_Empresa, Tipo)
);

-- Circulacion avanzada
CREATE TABLE Bib_Politica_Prestamo (
  Id_Politica_Prestamo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Tipo_Usuario VARCHAR(30) NOT NULL,
  Tipo_Material_Id INT NOT NULL,
  Dias_Prestamo INT NOT NULL DEFAULT 7,
  Max_Renovaciones INT NOT NULL DEFAULT 1,
  Max_Prestamos INT NOT NULL DEFAULT 3,
  Multa_Diaria DECIMAL(10,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_politica_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_politica_tipo FOREIGN KEY (Tipo_Material_Id) REFERENCES Bib_Tipo_Material(Id_Tipo_Material),
  UNIQUE KEY uq_politica (Id_Empresa, Tipo_Usuario, Tipo_Material_Id)
);

CREATE TABLE Bib_Prestamo (
  Id_Prestamo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Ejemplar_Id INT NOT NULL,
  Usuario_Id INT NOT NULL,
  Fecha_Prestamo DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Fecha_Vencimiento DATETIME NOT NULL,
  Fecha_Devolucion DATETIME,
  Renovaciones SMALLINT NOT NULL DEFAULT 0,
  Estado VARCHAR(20) NOT NULL DEFAULT 'activo',
  Observaciones TEXT,
  CONSTRAINT fk_prestamo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_prestamo_ejemplar FOREIGN KEY (Ejemplar_Id) REFERENCES Bib_Ejemplar(Id_Ejemplar),
  CONSTRAINT fk_prestamo_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca),
  CONSTRAINT ck_prestamo_estado CHECK (Estado IN ('activo','vencido','devuelto','perdido'))
);

CREATE TABLE Bib_Reserva (
  Id_Reserva INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Usuario_Id INT NOT NULL,
  Posicion INT NOT NULL,
  Estado VARCHAR(20) NOT NULL DEFAULT 'activa',
  Fecha_Reserva DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Fecha_Asignacion DATETIME,
  CONSTRAINT fk_reserva_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_reserva_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE,
  CONSTRAINT fk_reserva_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca),
  CONSTRAINT ck_reserva_estado CHECK (Estado IN ('activa','atendida','cancelada','liberada'))
);

CREATE TABLE Bib_Multa (
  Id_Multa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Usuario_Id INT NOT NULL,
  Prestamo_Id INT,
  Monto DECIMAL(12,2) NOT NULL,
  Saldo DECIMAL(12,2) NOT NULL,
  Motivo VARCHAR(300) NOT NULL,
  Fecha_Generacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Fecha_Pago DATETIME,
  Estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_multa_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_multa_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca),
  CONSTRAINT fk_multa_prestamo FOREIGN KEY (Prestamo_Id) REFERENCES Bib_Prestamo(Id_Prestamo) ON DELETE SET NULL,
  CONSTRAINT ck_multa_estado CHECK (Estado IN ('pendiente','pagada','condonada'))
);

-- Auditoria de circulacion
CREATE TABLE Bib_Auditoria_Circulacion (
  Id_Auditoria_Circulacion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Accion VARCHAR(50) NOT NULL,
  Usuario_Id INT,
  Ejemplar_Id INT,
  Prestamo_Id INT,
  Reserva_Id INT,
  Detalle JSON,
  Realizado_Por VARCHAR(150),
  Realizado_En DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_auditoria_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_auditoria_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca),
  CONSTRAINT fk_auditoria_ejemplar FOREIGN KEY (Ejemplar_Id) REFERENCES Bib_Ejemplar(Id_Ejemplar),
  CONSTRAINT fk_auditoria_prestamo FOREIGN KEY (Prestamo_Id) REFERENCES Bib_Prestamo(Id_Prestamo),
  CONSTRAINT fk_auditoria_reserva FOREIGN KEY (Reserva_Id) REFERENCES Bib_Reserva(Id_Reserva)
);

-- MARC21 / UNIMARC
CREATE TABLE Bib_Marc_Registro (
  Id_Marc_Registro INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Formato VARCHAR(20) NOT NULL, -- MARC21 / UNIMARC
  Leader VARCHAR(24),
  Control_001 VARCHAR(40),
  Control_005 VARCHAR(40),
  Control_008 VARCHAR(200),
  CONSTRAINT fk_marc_registro_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_marc_registro_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE
);

CREATE TABLE Bib_Marc_Campo (
  Id_Marc_Campo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Marc_Registro_Id INT NOT NULL,
  Tag VARCHAR(3) NOT NULL,
  Ind1 CHAR(1),
  Ind2 CHAR(1),
  Valor TEXT,
  CONSTRAINT fk_marc_campo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_marc_campo_registro FOREIGN KEY (Marc_Registro_Id) REFERENCES Bib_Marc_Registro(Id_Marc_Registro) ON DELETE CASCADE
);

CREATE TABLE Bib_Marc_Subcampo (
  Id_Marc_Subcampo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Marc_Campo_Id INT NOT NULL,
  Codigo CHAR(1) NOT NULL,
  Valor TEXT NOT NULL,
  CONSTRAINT fk_marc_subcampo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_marc_subcampo_campo FOREIGN KEY (Marc_Campo_Id) REFERENCES Bib_Marc_Campo(Id_Marc_Campo) ON DELETE CASCADE
);

CREATE TABLE Bib_Autoridad (
  Id_Autoridad INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Tipo VARCHAR(40) NOT NULL, -- autor, tema, entidad, serie
  Encabezado VARCHAR(300) NOT NULL,
  Formato VARCHAR(20) NOT NULL, -- MARC21 / UNIMARC
  CONSTRAINT fk_autoridad_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa)
);

CREATE TABLE Bib_Autoridad_Campo (
  Id_Autoridad_Campo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Autoridad_Id INT NOT NULL,
  Tag VARCHAR(3) NOT NULL,
  Ind1 CHAR(1),
  Ind2 CHAR(1),
  Valor TEXT,
  CONSTRAINT fk_autoridad_campo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_autoridad_campo_autoridad FOREIGN KEY (Autoridad_Id) REFERENCES Bib_Autoridad(Id_Autoridad) ON DELETE CASCADE
);

CREATE TABLE Bib_Autoridad_Subcampo (
  Id_Autoridad_Subcampo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Autoridad_Campo_Id INT NOT NULL,
  Codigo CHAR(1) NOT NULL,
  Valor TEXT NOT NULL,
  CONSTRAINT fk_autoridad_subcampo_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_autoridad_subcampo_campo FOREIGN KEY (Autoridad_Campo_Id) REFERENCES Bib_Autoridad_Campo(Id_Autoridad_Campo) ON DELETE CASCADE
);

-- Seriales avanzados
CREATE TABLE Bib_Suscripcion (
  Id_Suscripcion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Serial_Id INT NOT NULL,
  Proveedor VARCHAR(200),
  Fecha_Inicio DATE NOT NULL,
  Fecha_Fin DATE,
  Frecuencia VARCHAR(50) NOT NULL,
  Estado VARCHAR(20) NOT NULL DEFAULT 'activa',
  CONSTRAINT fk_suscripcion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_suscripcion_serial FOREIGN KEY (Serial_Id) REFERENCES Bib_Serial(Id_Serial) ON DELETE CASCADE
);

CREATE TABLE Bib_Serial_Numero (
  Id_Serial_Numero INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Serial_Id INT NOT NULL,
  Volumen VARCHAR(30),
  Numero VARCHAR(30),
  Fecha_Prevista DATE,
  Fecha_Recibido DATE,
  Estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
  CONSTRAINT fk_serial_numero_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_serial_numero_serial FOREIGN KEY (Serial_Id) REFERENCES Bib_Serial(Id_Serial) ON DELETE CASCADE
);

CREATE TABLE Bib_Serial_Recepcion (
  Id_Serial_Recepcion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Serial_Numero_Id INT NOT NULL,
  Ejemplar_Id INT,
  Fecha_Recepcion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Estado VARCHAR(20) NOT NULL DEFAULT 'recibido',
  CONSTRAINT fk_serial_recepcion_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_serial_recepcion_numero FOREIGN KEY (Serial_Numero_Id) REFERENCES Bib_Serial_Numero(Id_Serial_Numero) ON DELETE CASCADE,
  CONSTRAINT fk_serial_recepcion_ejemplar FOREIGN KEY (Ejemplar_Id) REFERENCES Bib_Ejemplar(Id_Ejemplar)
);

-- OPAC
CREATE TABLE Bib_Opac_Comentario (
  Id_Opac_Comentario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Usuario_Id INT NOT NULL,
  Calificacion TINYINT,
  Comentario TEXT,
  Estado VARCHAR(20) NOT NULL DEFAULT 'publicado',
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_opac_comentario_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_opac_comentario_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE,
  CONSTRAINT fk_opac_comentario_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca)
);

CREATE TABLE Bib_Opac_Etiqueta (
  Id_Opac_Etiqueta INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Libro_Id INT NOT NULL,
  Usuario_Id INT NOT NULL,
  Etiqueta VARCHAR(80) NOT NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_opac_etiqueta_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_opac_etiqueta_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE,
  CONSTRAINT fk_opac_etiqueta_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca)
);

CREATE TABLE Bib_Opac_Lista (
  Id_Opac_Lista INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Usuario_Id INT NOT NULL,
  Nombre VARCHAR(120) NOT NULL,
  Descripcion VARCHAR(200),
  CONSTRAINT fk_opac_lista_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_opac_lista_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca)
);

CREATE TABLE Bib_Opac_Lista_Item (
  Id_Opac_Lista_Item INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Lista_Id INT NOT NULL,
  Libro_Id INT NOT NULL,
  CONSTRAINT fk_opac_lista_item_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_opac_lista_item_lista FOREIGN KEY (Lista_Id) REFERENCES Bib_Opac_Lista(Id_Opac_Lista) ON DELETE CASCADE,
  CONSTRAINT fk_opac_lista_item_libro FOREIGN KEY (Libro_Id) REFERENCES Bib_Libro(Id_Libro) ON DELETE CASCADE
);

CREATE TABLE Bib_Opac_Historial_Busqueda (
  Id_Opac_Historial_Busqueda INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Usuario_Id INT NOT NULL,
  Consulta VARCHAR(300) NOT NULL,
  Creado_El DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_opac_historial_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_opac_historial_usuario FOREIGN KEY (Usuario_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca)
);

-- Roles y permisos (menu por perfil)
CREATE TABLE Bib_Rol (
  Id_Rol INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Nombre VARCHAR(60) NOT NULL, -- alumno, bibliotecario, docente, admin
  CONSTRAINT fk_rol_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_rol (Id_Empresa, Nombre)
);

CREATE TABLE Bib_Permiso (
  Id_Permiso INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Codigo VARCHAR(80) NOT NULL, -- catalogo.ver, catalogo.crear, prestamos.gestionar, opac.ver
  Descripcion VARCHAR(200),
  CONSTRAINT fk_permiso_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  UNIQUE KEY uq_permiso (Id_Empresa, Codigo)
);

CREATE TABLE Bib_Rol_Permiso (
  Id_Rol_Permiso INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Rol_Id INT NOT NULL,
  Permiso_Id INT NOT NULL,
  CONSTRAINT fk_rol_permiso_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_rol_permiso_rol FOREIGN KEY (Rol_Id) REFERENCES Bib_Rol(Id_Rol),
  CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY (Permiso_Id) REFERENCES Bib_Permiso(Id_Permiso),
  UNIQUE KEY uq_rol_permiso (Id_Empresa, Rol_Id, Permiso_Id)
);

CREATE TABLE Bib_Usuario_Rol (
  Id_Usuario_Rol INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  Id_Empresa INT NOT NULL,
  Usuario_Biblioteca_Id INT NOT NULL,
  Rol_Id INT NOT NULL,
  CONSTRAINT fk_usuario_rol_empresa FOREIGN KEY (Id_Empresa) REFERENCES Gen_Empresa(Id_Empresa),
  CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (Usuario_Biblioteca_Id) REFERENCES Bib_Usuario_Biblioteca(Id_Usuario_Biblioteca),
  CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (Rol_Id) REFERENCES Bib_Rol(Id_Rol),
  UNIQUE KEY uq_usuario_rol (Id_Empresa, Usuario_Biblioteca_Id, Rol_Id)
);

SET FOREIGN_KEY_CHECKS = 1;
