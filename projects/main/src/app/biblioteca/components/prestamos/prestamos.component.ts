import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Prestamo } from '../../models/biblioteca.models';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {
  prestamos: Prestamo[] = [];

  constructor(private dataService: BibliotecaDataService) {
    this.prestamos = this.dataService.getPrestamos();
  }
}
