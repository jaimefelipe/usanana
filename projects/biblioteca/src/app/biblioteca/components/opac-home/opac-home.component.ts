import { Component, OnInit } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, TipoMaterial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-home',
  templateUrl: './opac-home.component.html',
  styleUrls: ['./opac-home.component.css']
})
export class OpacHomeComponent implements OnInit {
  termino = '';
  tipoMaterial = 'todos';
  libros: Libro[] = [];
  tiposMaterial: TipoMaterial[] = [];

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    this.libros = await this.dataService.getLibros();
    this.tiposMaterial = await this.dataService.getTiposMaterial();
  }

  get resultados(): Libro[] {
    return this.libros.filter(libro => {
      const termino = this.termino.toLowerCase();
      const coincideTexto =
        this.termino === '' ||
        libro.titulo.toLowerCase().includes(termino) ||
        (libro.autores || libro.autor || '').toLowerCase().includes(termino) ||
        (libro.isbn || '').toLowerCase().includes(termino);
      const coincideTipo = this.tipoMaterial === 'todos' || String(libro.tipoMaterialId) === this.tipoMaterial;
      return coincideTexto && coincideTipo;
    });
  }
}
