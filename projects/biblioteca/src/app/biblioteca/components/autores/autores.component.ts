import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Autor } from '../../models/biblioteca.models';

@Component({
  selector: 'app-autores',
  templateUrl: './autores.component.html',
  styleUrls: ['./autores.component.css']
})
export class AutoresComponent implements OnInit {
  autores: Autor[] = [];
  autor: Autor = { id: 0, nombre: '', nacionalidad: '', fechaNacimiento: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.autores = await this.dataService.getAutores();
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
    this.autor = { id: 0, nombre: '', nacionalidad: '', fechaNacimiento: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Autor) {
    this.autor = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.autor.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateAutor(this.autor);
        Swal.fire('Autor actualizado');
      } else {
        await this.dataService.createAutor(this.autor);
        Swal.fire('Autor creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el autor');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Autor) {
    const result = await Swal.fire({
      title: 'Eliminar autor',
      text: 'Se eliminara el autor seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteAutor(item.id);
      await this.cargar();
      if (this.esEdicion && this.autor.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Autor eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el autor');
    }
  }
}
