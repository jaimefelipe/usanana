import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';

@Component({
  selector: 'app-dashboard-biblioteca',
  templateUrl: './dashboard-biblioteca.component.html',
  styleUrls: ['./dashboard-biblioteca.component.css']
})
export class DashboardBibliotecaComponent {
  librosDisponibles = 0;
  prestamosActivos = 0;
  prestamosVencidos = 0;
  reservasActivas = 0;

  constructor(private dataService: BibliotecaDataService) {
    const libros = this.dataService.getLibros();
    this.librosDisponibles = libros.filter(libro => libro.estado === 'disponible').length;
    const prestamos = this.dataService.getPrestamos();
    this.prestamosActivos = prestamos.filter(prestamo => prestamo.estado === 'activo').length;
    this.prestamosVencidos = prestamos.filter(prestamo => prestamo.estado === 'vencido').length;
    this.reservasActivas = this.dataService.getReservas().length;
  }
}
