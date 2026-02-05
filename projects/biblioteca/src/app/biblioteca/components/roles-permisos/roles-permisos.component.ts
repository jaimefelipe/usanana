import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { PermisoBiblioteca, RolBiblioteca, RolPermiso } from '../../models/biblioteca.models';

@Component({
  selector: 'app-roles-permisos',
  templateUrl: './roles-permisos.component.html',
  styleUrls: ['./roles-permisos.component.css']
})
export class RolesPermisosComponent implements OnInit {
  rolesPermisos: RolPermiso[] = [];
  roles: RolBiblioteca[] = [];
  permisos: PermisoBiblioteca[] = [];
  relacion: RolPermiso = { id: 0, rolId: 0, permisoId: 0 };
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.roles = await this.dataService.getRoles();
    this.permisos = await this.dataService.getPermisos();
    this.rolesPermisos = await this.dataService.getRolesPermisos();
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
    this.relacion = { id: 0, rolId: 0, permisoId: 0 };
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  seleccionar(item: RolPermiso) {
    this.relacion = { ...item };
    this.edit = true;
  }

  async guardar() {
    if (!this.relacion.rolId || !this.relacion.permisoId) {
      Swal.fire('Seleccione rol y permiso');
      return;
    }

    try {
      await this.dataService.createRolPermiso(this.relacion);
      this.resetForm();
      this.edit = false;
      await this.cargar();
      Swal.fire('Permiso asignado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al asignar el permiso');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: RolPermiso) {
    const result = await Swal.fire({
      title: 'Eliminar asignacion',
      text: 'Se eliminara la asignacion seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteRolPermiso(item.id);
      await this.cargar();
      if (this.relacion.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Asignacion eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la asignacion');
    }
  }
}
