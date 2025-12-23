import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Reserva } from '../../models/biblioteca.models';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  reservas: Reserva[] = [];

  constructor(private dataService: BibliotecaDataService) {
    this.reservas = this.dataService.getReservas();
  }
}
