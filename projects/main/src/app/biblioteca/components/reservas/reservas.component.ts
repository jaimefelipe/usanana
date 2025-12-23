import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Reserva } from '../../models/biblioteca.models';

interface ReservaDetalle extends Reserva {
  titulo: string;
  categoria: string;
}

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  reservas: ReservaDetalle[] = [];

  constructor(private dataService: BibliotecaDataService) {
    const libros = this.dataService.getLibros();
    this.reservas = this.dataService.getReservas().map(reserva => {
      const libro = libros.find(l => l.id === reserva.libroId);
      return {
        ...reserva,
        titulo: libro ? libro.titulo : `Libro ${reserva.libroId}`,
        categoria: libro ? libro.categoria : 'Sin categoría'
      };
    });
  }
}
