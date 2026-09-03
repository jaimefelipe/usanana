import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, TipoMaterial, esAccesoAbierto } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-home',
  templateUrl: './opac-home.component.html',
  styleUrls: ['./opac-home.component.css']
})
export class OpacHomeComponent implements OnInit {
  esAccesoAbierto = esAccesoAbierto;
  termino = '';
  tipoMaterial = 'todos';
  libros: Libro[] = [];
  tiposMaterial: TipoMaterial[] = [];
  procesandoId: number | null = null;
  favoritos: number[] = this.cargarFavoritos();

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

  async solicitarPrestamo(libro: Libro) {
    this.procesandoId = libro.id;
    try {
      await this.dataService.solicitarPrestamoLibro(libro.id);
      Swal.fire('Prestamo registrado', 'Ya puedes ver el ejemplar en Mi cuenta.', 'success');
      this.libros = await this.dataService.getLibros();
    } catch (error) {
      console.error(error);
      const mensaje = error instanceof Error ? error.message : 'No se pudo registrar el prestamo';
      Swal.fire('No se pudo registrar el prestamo', mensaje, 'warning');
    } finally {
      this.procesandoId = null;
    }
  }

  async reservar(libro: Libro) {
    this.procesandoId = libro.id;
    try {
      await this.dataService.createReserva(libro.id);
      Swal.fire('Reserva registrada', 'La biblioteca te notificara cuando el libro este disponible.', 'success');
    } catch (error) {
      console.error(error);
      const mensaje = error instanceof Error ? error.message : 'No se pudo crear la reserva';
      Swal.fire('No se pudo crear la reserva', mensaje, 'warning');
    } finally {
      this.procesandoId = null;
    }
  }

  private cargarFavoritos(): number[] {
    try {
      return JSON.parse(localStorage.getItem('Bib_Favoritos') || '[]');
    } catch {
      return [];
    }
  }

  esFavorito(idLibro: number): boolean {
    return this.favoritos.includes(idLibro);
  }

  toggleFavorito(libro: Libro) {
    this.favoritos = this.esFavorito(libro.id)
      ? this.favoritos.filter(id => id !== libro.id)
      : [...this.favoritos, libro.id];
    localStorage.setItem('Bib_Favoritos', JSON.stringify(this.favoritos));
  }
}
