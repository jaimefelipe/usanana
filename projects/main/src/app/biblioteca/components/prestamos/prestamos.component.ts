import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Prestamo } from '../../models/biblioteca.models';

interface PrestamoDetalle extends Prestamo {
  titulo: string;
  categoria: string;
}

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent {
  prestamos: PrestamoDetalle[] = [];

  constructor(private dataService: BibliotecaDataService) {
    const libros = this.dataService.getLibros();
    this.prestamos = this.dataService.getPrestamos().map((prestamo: Prestamo) => {
      const libro = libros.find(l => l.id === prestamo.libroId);
      return {
        ...prestamo,
        titulo: libro ? libro.titulo : `Libro ${prestamo.libroId}`,
        categoria: libro ? libro.categoria : 'Sin categoría'
      };
    });
  }
}
