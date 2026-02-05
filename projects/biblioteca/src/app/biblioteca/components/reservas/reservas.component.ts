import { Component, OnInit } from '@angular/core';
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
export class ReservasComponent implements OnInit {
  reservas: ReservaDetalle[] = [];
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.searchField = this.searchField.trim();
  }

  async cargar() {
    const libros = await this.dataService.getLibros();
    const reservas = await this.dataService.getReservas();
    this.reservas = reservas.map(reserva => {
      const libro = libros.find(l => l.id === reserva.libroId);
      return {
        ...reserva,
        titulo: libro ? libro.titulo : `Libro ${reserva.libroId}`,
        categoria: libro ? libro.categoria : 'Sin categoria'
      };
    });
  }

  async atender(reserva: ReservaDetalle) {
    try {
      await this.dataService.atenderReserva(reserva.id);
      await this.cargar();
    } catch (error) {
      console.error(error);
    }
  }

  async cancelar(reserva: ReservaDetalle) {
    try {
      await this.dataService.cancelReserva(reserva.id);
      await this.cargar();
    } catch (error) {
      console.error(error);
    }
  }
}
