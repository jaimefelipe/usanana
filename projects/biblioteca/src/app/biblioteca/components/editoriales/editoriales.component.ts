import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Editorial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-editoriales',
  templateUrl: './editoriales.component.html',
  styleUrls: ['./editoriales.component.css']
})
export class EditorialesComponent implements OnInit {
  editoriales: Editorial[] = [];
  editorial: Editorial = { id: 0, nombre: '', sitioWeb: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.editoriales = await this.dataService.getEditoriales();
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
    this.editorial = { id: 0, nombre: '', sitioWeb: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Editorial) {
    this.editorial = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.editorial.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateEditorial(this.editorial);
        Swal.fire('Editorial actualizada');
      } else {
        await this.dataService.createEditorial(this.editorial);
        Swal.fire('Editorial creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la editorial');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Editorial) {
    const result = await Swal.fire({
      title: 'Eliminar editorial',
      text: 'Se eliminara la editorial seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteEditorial(item.id);
      await this.cargar();
      if (this.esEdicion && this.editorial.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Editorial eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la editorial');
    }
  }
}
