import { Injectable } from '@angular/core';
import { Libro, Prestamo, Reserva, UsuarioBiblioteca } from '../models/biblioteca.models';

@Injectable({
  providedIn: 'root'
})
export class BibliotecaDataService {
  private libros: Libro[] = [
    { id: 1, titulo: 'Clean Code', autor: 'Robert C. Martin', isbn: '978-0132350884', categoria: 'Ingeniería', estado: 'disponible' },
    { id: 2, titulo: 'El nombre del viento', autor: 'Patrick Rothfuss', isbn: '978-8499082479', categoria: 'Fantasía', estado: 'prestado' },
    { id: 3, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', isbn: '978-0307474728', categoria: 'Literatura', estado: 'reservado' },
    { id: 4, titulo: 'Domain-Driven Design', autor: 'Eric Evans', isbn: '978-0321125217', categoria: 'Ingeniería', estado: 'disponible' },
    { id: 5, titulo: 'Sapiens', autor: 'Yuval Noah Harari', isbn: '978-0062316097', categoria: 'Historia', estado: 'perdido' }
  ];

  private prestamos: Prestamo[] = [
    { id: 1, libroId: 1, usuario: 'Laura Rojas', fechaPrestamo: '2024-05-10', fechaVencimiento: '2024-05-24', renovaciones: 0, estado: 'activo' },
    { id: 2, libroId: 2, usuario: 'Carlos Mena', fechaPrestamo: '2024-05-01', fechaVencimiento: '2024-05-15', renovaciones: 1, estado: 'vencido' },
    { id: 3, libroId: 4, usuario: 'Ana Solís', fechaPrestamo: '2024-05-12', fechaVencimiento: '2024-05-26', renovaciones: 0, estado: 'activo' }
  ];

  private reservas: Reserva[] = [
    { id: 1, libroId: 3, usuario: 'Ana Ruiz', posicion: 1, estado: 'activa' },
    { id: 2, libroId: 5, usuario: 'María Soto', posicion: 1, estado: 'activa' }
  ];

  private usuarios: UsuarioBiblioteca[] = [
    { id: 1, nombre: 'Laura Rojas', bloqueado: false, prestamosActivos: 1, multasPendientes: 0 },
    { id: 2, nombre: 'Carlos Mena', bloqueado: true, prestamosActivos: 1, multasPendientes: 2 },
    { id: 3, nombre: 'Ana Solís', bloqueado: false, prestamosActivos: 1, multasPendientes: 0 },
    { id: 4, nombre: 'María Soto', bloqueado: false, prestamosActivos: 0, multasPendientes: 0 }
  ];

  getLibros(): Libro[] {
    return this.libros;
  }

  getPrestamos(): Prestamo[] {
    return this.prestamos;
  }

  getReservas(): Reserva[] {
    return this.reservas;
  }

  getUsuarios(): UsuarioBiblioteca[] {
    return this.usuarios;
  }

  getLibroById(id: number): Libro | undefined {
    return this.libros.find(libro => libro.id === id);
  }
}
