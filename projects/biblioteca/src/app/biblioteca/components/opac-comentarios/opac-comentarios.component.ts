import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, OpacComentario, UsuarioBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-comentarios',
  templateUrl: './opac-comentarios.component.html',
  styleUrls: ['./opac-comentarios.component.css']
})
export class OpacComentariosComponent implements OnInit {
  comentarios: OpacComentario[] = [];
  libros: Libro[] = [];
  usuarios: UsuarioBiblioteca[] = [];
  comentario: OpacComentario = {
    id: 0,
    libroId: 0,
    usuarioId: 0,
    calificacion: 0,
    comentario: '',
    estado: 'publicado'
  };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.libros = await this.dataService.getLibros();
    this.usuarios = await this.dataService.getUsuarios();
    this.comentarios = await this.dataService.getOpacComentarios();
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
    this.comentario = {
      id: 0,
      libroId: 0,
      usuarioId: 0,
      calificacion: 0,
      comentario: '',
      estado: 'publicado'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: OpacComentario) {
    this.comentario = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.comentario.libroId || !this.comentario.usuarioId) {
      Swal.fire('Complete libro y usuario');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateOpacComentario(this.comentario);
        Swal.fire('Comentario actualizado');
      } else {
        await this.dataService.createOpacComentario(this.comentario);
        Swal.fire('Comentario creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el comentario');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: OpacComentario) {
    const result = await Swal.fire({
      title: 'Eliminar comentario',
      text: 'Se eliminara el comentario seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteOpacComentario(item.id);
      await this.cargar();
      if (this.esEdicion && this.comentario.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Comentario eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el comentario');
    }
  }
}
