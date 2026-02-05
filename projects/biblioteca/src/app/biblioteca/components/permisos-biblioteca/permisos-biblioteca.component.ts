import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { PermisoBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-permisos-biblioteca',
  templateUrl: './permisos-biblioteca.component.html',
  styleUrls: ['./permisos-biblioteca.component.css']
})
export class PermisosBibliotecaComponent implements OnInit {
  permisos: PermisoBiblioteca[] = [];
  permiso: PermisoBiblioteca = { id: 0, codigo: '', descripcion: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.permisos = await this.dataService.getPermisos();
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
    this.permiso = { id: 0, codigo: '', descripcion: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: PermisoBiblioteca) {
    this.permiso = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.permiso.codigo) {
      Swal.fire('Complete el codigo');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updatePermiso(this.permiso);
        Swal.fire('Permiso actualizado');
      } else {
        await this.dataService.createPermiso(this.permiso);
        Swal.fire('Permiso creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el permiso');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: PermisoBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar permiso',
      text: 'Se eliminara el permiso seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deletePermiso(item.id);
      await this.cargar();
      if (this.esEdicion && this.permiso.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Permiso eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el permiso');
    }
  }
}
