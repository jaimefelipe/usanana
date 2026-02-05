import { Component, OnInit } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';

@Component({
  selector: 'app-reportes-biblioteca',
  templateUrl: './reportes-biblioteca.component.html',
  styleUrls: ['./reportes-biblioteca.component.css']
})
export class ReportesBibliotecaComponent implements OnInit {
  resumen = {
    libros: 'Total libros: 0',
    prestamos: 'Prestamos activos: 0',
    reservas: 'Reservas activas: 0',
    multas: 'Multas pendientes: 0',
    usuarios: 'Usuarios biblioteca: 0'
  };

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    const [libros, prestamos, reservas, multas, usuarios] = await Promise.all([
      this.dataService.getLibros(),
      this.dataService.getPrestamos(),
      this.dataService.getReservas(),
      this.dataService.getMultas(),
      this.dataService.getUsuarios()
    ]);
    this.resumen.libros = `Total libros: ${libros.length}`;
    this.resumen.prestamos = `Prestamos activos: ${prestamos.filter(p => p.estado === 'activo').length}`;
    this.resumen.reservas = `Reservas activas: ${reservas.filter(r => r.estado === 'activa').length}`;
    this.resumen.multas = `Multas pendientes: ${multas.filter(m => m.estado === 'pendiente').length}`;
    this.resumen.usuarios = `Usuarios biblioteca: ${usuarios.length}`;
  }
}
