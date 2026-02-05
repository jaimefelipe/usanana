import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Categoria } from '../../models/biblioteca.models';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit {
  categorias: Categoria[] = [];
  categoria: Categoria = { id: 0, nombre: '', codigo: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.categorias = await this.dataService.getCategorias();
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
    this.categoria = { id: 0, nombre: '', codigo: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Categoria) {
    this.categoria = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.categoria.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateCategoria(this.categoria);
        Swal.fire('Categoria actualizada');
      } else {
        await this.dataService.createCategoria(this.categoria);
        Swal.fire('Categoria creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la categoria');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Categoria) {
    const result = await Swal.fire({
      title: 'Eliminar categoria',
      text: 'Se eliminara la categoria seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteCategoria(item.id);
      await this.cargar();
      if (this.esEdicion && this.categoria.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Categoria eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la categoria');
    }
  }
}
