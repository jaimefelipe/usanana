import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';

@Component({
  selector: 'app-reportes-biblioteca',
  templateUrl: './reportes-biblioteca.component.html',
  styleUrls: ['./reportes-biblioteca.component.css']
})
export class ReportesBibliotecaComponent {
  resumen = {
    rotacion: 'Top libros solicitados: Clean Code, El nombre del viento',
    mora: 'Multas activas: 2 usuarios con mora',
    reservas: 'Reservas activas: 1'
  };

  constructor(private dataService: BibliotecaDataService) {
    const reservas = this.dataService.getReservas();
    this.resumen.reservas = `Reservas activas: ${reservas.length}`;
  }
}
