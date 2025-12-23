export interface Libro {
  id: number;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  estado: 'disponible' | 'prestado' | 'reservado' | 'perdido';
}

export interface Prestamo {
  id: number;
  libroId: number;
  usuario: string;
  fechaPrestamo: string;
  fechaVencimiento: string;
  renovaciones: number;
  estado: 'activo' | 'vencido' | 'devuelto';
}

export interface Reserva {
  id: number;
  libroId: number;
  usuario: string;
  posicion: number;
  estado: 'activa' | 'atendida';
}

export interface UsuarioBiblioteca {
  id: number;
  nombre: string;
  bloqueado: boolean;
  prestamosActivos: number;
  multasPendientes: number;
}
