import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, OpacEtiqueta, UsuarioBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-etiquetas',
  templateUrl: './opac-etiquetas.component.html',
  styleUrls: ['./opac-etiquetas.component.css']
})
export class OpacEtiquetasComponent implements OnInit {
  etiquetas: OpacEtiqueta[] = [];
  libros: Libro[] = [];
  usuarios: UsuarioBiblioteca[] = [];
  etiqueta: OpacEtiqueta = { id: 0, libroId: 0, usuarioId: 0, etiqueta: '' };
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.libros = await this.dataService.getLibros();
    this.usuarios = await this.dataService.getUsuarios();
    this.etiquetas = await this.dataService.getOpacEtiquetas();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.searchField = this.searchField.trim();
  }

  resetForm() {
    this.etiqueta = { id: 0, libroId: 0, usuarioId: 0, etiqueta: '' };
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  async guardar() {
    if (!this.etiqueta.libroId || !this.etiqueta.usuarioId || !this.etiqueta.etiqueta) {
      Swal.fire('Complete libro, usuario y etiqueta');
      return;
    }

    try {
      await this.dataService.createOpacEtiqueta(this.etiqueta);
      this.resetForm();
      this.edit = false;
      await this.cargar();
      Swal.fire('Etiqueta creada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la etiqueta');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: OpacEtiqueta) {
    const result = await Swal.fire({
      title: 'Eliminar etiqueta',
      text: 'Se eliminara la etiqueta seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteOpacEtiqueta(item.id);
      await this.cargar();
      if (this.etiqueta.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Etiqueta eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la etiqueta');
    }
  }
}
