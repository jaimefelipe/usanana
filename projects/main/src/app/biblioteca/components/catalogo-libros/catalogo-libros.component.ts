import { Component } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro } from '../../models/biblioteca.models';

@Component({
  selector: 'app-catalogo-libros',
  templateUrl: './catalogo-libros.component.html',
  styleUrls: ['./catalogo-libros.component.css']
})
export class CatalogoLibrosComponent {
  termino = '';
  estado = 'todos';
  libros: Libro[] = [];

  constructor(private dataService: BibliotecaDataService) {
    this.libros = this.dataService.getLibros();
  }

  get librosFiltrados(): Libro[] {
    return this.libros.filter(libro => {
      const coincideTexto = this.termino === '' || libro.titulo.toLowerCase().includes(this.termino.toLowerCase()) || libro.autor.toLowerCase().includes(this.termino.toLowerCase());
      const coincideEstado = this.estado === 'todos' || libro.estado === this.estado;
      return coincideTexto && coincideEstado;
    });
  }
}
