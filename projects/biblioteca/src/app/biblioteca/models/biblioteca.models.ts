export interface Libro {
  id: number;
  titulo: string;
  subtitulo?: string;
  autor: string;
  autores?: string;
  autoresIds?: number[];
  isbn: string;
  issn?: string;
  doi?: string;
  categoria: string;
  editorial?: string;
  tipoMaterial?: string;
  estado: 'disponible' | 'prestado' | 'reservado' | 'perdido' | 'mantenimiento';
  idioma?: string;
  anioPublicacion?: number;
  edicion?: string;
  descripcion?: string;
  palabrasClave?: string;
  urlPublica?: string;
  categoriaId?: number;
  editorialId?: number;
  tipoMaterialId?: number;
}

export interface Prestamo {
  id: number;
  libroId: number;
  ejemplarId?: number;
  usuario: string;
  usuarioId?: number;
  fechaPrestamo: string;
  fechaVencimiento: string;
  fechaDevolucion?: string;
  renovaciones: number;
  estado: 'activo' | 'vencido' | 'devuelto' | 'perdido';
  observaciones?: string;
}

export interface Reserva {
  id: number;
  libroId: number;
  usuarioId?: number;
  usuario: string;
  posicion: number;
  estado: 'activa' | 'atendida' | 'liberada' | 'cancelada';
  fechaReserva?: string;
  fechaAsignacion?: string;
}

export interface UsuarioBiblioteca {
  id: number;
  idPersona?: number;
  idUsuario?: number;
  codigoUniversitario?: string;
  nombre: string;
  email?: string;
  telefono?: string;
  tipoUsuario?: string;
  bloqueado: boolean;
  prestamosActivos: number;
  multasPendientes: number;
  multaAcumulada?: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  codigo?: string;
}

export interface Editorial {
  id: number;
  nombre: string;
  sitioWeb?: string;
}

export interface Autor {
  id: number;
  nombre: string;
  nacionalidad?: string;
  fechaNacimiento?: string;
}

export interface TipoMaterial {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Ejemplar {
  id: number;
  libroId: number;
  libroTitulo?: string;
  codigoBarra?: string;
  ubicacion?: string;
  sede?: string;
  tipoSoporte: string;
  estado: string;
  inventarioTag?: string;
  urlArchivo?: string;
}

export interface PoliticaPrestamo {
  id: number;
  tipoUsuario: string;
  tipoMaterialId: number;
  diasPrestamo: number;
  maxRenovaciones: number;
  maxPrestamos: number;
  multaDiaria: number;
}

export interface Multa {
  id: number;
  usuarioId: number;
  usuarioNombre?: string;
  prestamoId?: number;
  monto: number;
  saldo: number;
  motivo: string;
  fechaGeneracion: string;
  fechaPago?: string;
  estado: string;
}

export interface RolBiblioteca {
  id: number;
  nombre: string;
}

export interface PermisoBiblioteca {
  id: number;
  codigo: string;
  descripcion?: string;
}

export interface RolPermiso {
  id: number;
  rolId: number;
  permisoId: number;
  rolNombre?: string;
  permisoCodigo?: string;
}

export interface UsuarioRol {
  id: number;
  usuarioBibliotecaId: number;
  rolId: number;
  usuarioNombre?: string;
  rolNombre?: string;
}

export interface Serial {
  id: number;
  libroId: number;
  libroTitulo?: string;
  frecuencia?: string;
}

export interface SuscripcionSerial {
  id: number;
  serialId: number;
  proveedor?: string;
  fechaInicio: string;
  fechaFin?: string;
  frecuencia: string;
  estado: string;
}

export interface SerialNumero {
  id: number;
  serialId: number;
  volumen?: string;
  numero?: string;
  fechaPrevista?: string;
  fechaRecibido?: string;
  estado: string;
}

export interface SerialRecepcion {
  id: number;
  serialNumeroId: number;
  ejemplarId?: number;
  fechaRecepcion: string;
  estado: string;
}

export interface Tesis {
  id: number;
  libroId: number;
  universidad?: string;
  facultad?: string;
  carrera?: string;
  tutor?: string;
  autorInstitucional?: string;
  fechaDefensa?: string;
}

export interface MarcRegistro {
  id: number;
  libroId: number;
  formato: string;
  leader?: string;
  control001?: string;
  control005?: string;
  control008?: string;
}

export interface MarcCampo {
  id: number;
  marcRegistroId: number;
  tag: string;
  ind1?: string;
  ind2?: string;
  valor?: string;
}

export interface MarcSubcampo {
  id: number;
  marcCampoId: number;
  codigo: string;
  valor: string;
}

export interface MarcDicFormato {
  id: number;
  codigo: string;
  nombre: string;
  fuente?: string;
  version?: string;
  urlFuente?: string;
  activo: boolean;
  creadoEl?: string;
}

export interface MarcDicCampo {
  id: number;
  formatoId: number;
  formatoNombre?: string;
  tag: string;
  nombre: string;
  grupo?: string;
  repetibilidad?: 'NR' | 'R';
  esControl: boolean;
  esObsoleto: boolean;
  orden?: number;
}

export interface MarcDicSubcampo {
  id: number;
  formatoId: number;
  formatoNombre?: string;
  tag: string;
  codigo: string;
  nombre: string;
  repetibilidad?: 'NR' | 'R';
  esObsoleto: boolean;
}

export interface MarcDicIndicador {
  id: number;
  formatoId: number;
  formatoNombre?: string;
  tag: string;
  posicion: number;
  valor: string;
  significado: string;
}

export interface Autoridad {
  id: number;
  tipo: string;
  encabezado: string;
  formato: string;
}

export interface AutoridadCampo {
  id: number;
  autoridadId: number;
  tag: string;
  ind1?: string;
  ind2?: string;
  valor?: string;
}

export interface AutoridadSubcampo {
  id: number;
  autoridadCampoId: number;
  codigo: string;
  valor: string;
}

export interface OpacComentario {
  id: number;
  libroId: number;
  usuarioId: number;
  usuarioNombre?: string;
  calificacion?: number;
  comentario?: string;
  estado: string;
  creadoEl?: string;
}

export interface OpacEtiqueta {
  id: number;
  libroId: number;
  usuarioId: number;
  etiqueta: string;
  creadoEl?: string;
}

export interface OpacLista {
  id: number;
  usuarioId: number;
  nombre: string;
  descripcion?: string;
}

export interface OpacListaItem {
  id: number;
  listaId: number;
  libroId: number;
  libroTitulo?: string;
}

export interface OpacHistorialBusqueda {
  id: number;
  usuarioId: number;
  consulta: string;
  creadoEl?: string;
}

export interface ProveedorBiblioteca {
  id: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado?: string;
}

export interface PresupuestoBiblioteca {
  id: number;
  nombre: string;
  anio: number;
  monto: number;
  saldo: number;
  estado?: string;
}

export interface OrdenCompraBiblioteca {
  id: number;
  proveedorId: number;
  presupuestoId?: number;
  proveedorNombre?: string;
  presupuestoNombre?: string;
  fecha: string;
  estado: string;
  total: number;
  observaciones?: string;
}

export interface OrdenCompraDetalleBiblioteca {
  id: number;
  ordenCompraId: number;
  descripcion: string;
  cantidad: number;
  costoUnitario: number;
  subtotal: number;
}

export interface FacturaCompraBiblioteca {
  id: number;
  ordenCompraId?: number;
  proveedorId: number;
  proveedorNombre?: string;
  numero: string;
  fecha: string;
  total: number;
  estado: string;
}

export interface CotizacionBiblioteca {
  id: number;
  proveedorId: number;
  proveedorNombre?: string;
  descripcion: string;
  fecha: string;
  total: number;
  estado: string;
}

export interface SedeBiblioteca {
  id: number;
  nombre: string;
  codigo?: string;
  direccion?: string;
  telefono?: string;
  estado?: string;
}

export interface IntegracionBiblioteca {
  id: number;
  tipo: string;
  endpoint: string;
  usuario?: string;
  clave?: string;
  puerto?: number;
  estado: string;
  notas?: string;
}
