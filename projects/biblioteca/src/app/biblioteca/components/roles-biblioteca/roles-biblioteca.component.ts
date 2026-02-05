import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { RolBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-roles-biblioteca',
  templateUrl: './roles-biblioteca.component.html',
  styleUrls: ['./roles-biblioteca.component.css']
})
export class RolesBibliotecaComponent implements OnInit {
  roles: RolBiblioteca[] = [];
  rol: RolBiblioteca = { id: 0, nombre: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.roles = await this.dataService.getRoles();
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
    this.rol = { id: 0, nombre: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: RolBiblioteca) {
    this.rol = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.rol.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateRol(this.rol);
        Swal.fire('Rol actualizado');
      } else {
        await this.dataService.createRol(this.rol);
        Swal.fire('Rol creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el rol');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: RolBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar rol',
      text: 'Se eliminara el rol seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteRol(item.id);
      await this.cargar();
      if (this.esEdicion && this.rol.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Rol eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el rol');
    }
  }
}
