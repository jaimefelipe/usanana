import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { RolBiblioteca, UsuarioBiblioteca, UsuarioRol } from '../../models/biblioteca.models';

@Component({
  selector: 'app-usuarios-roles',
  templateUrl: './usuarios-roles.component.html',
  styleUrls: ['./usuarios-roles.component.css']
})
export class UsuariosRolesComponent implements OnInit {
  usuariosRoles: UsuarioRol[] = [];
  usuarios: UsuarioBiblioteca[] = [];
  roles: RolBiblioteca[] = [];
  relacion: UsuarioRol = { id: 0, usuarioBibliotecaId: 0, rolId: 0 };
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.usuarios = await this.dataService.getUsuarios();
    this.roles = await this.dataService.getRoles();
    this.usuariosRoles = await this.dataService.getUsuariosRoles();
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
    this.relacion = { id: 0, usuarioBibliotecaId: 0, rolId: 0 };
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  seleccionar(item: UsuarioRol) {
    this.relacion = { ...item };
    this.edit = true;
  }

  async guardar() {
    if (!this.relacion.usuarioBibliotecaId || !this.relacion.rolId) {
      Swal.fire('Seleccione usuario y rol');
      return;
    }

    try {
      await this.dataService.createUsuarioRol(this.relacion);
      this.resetForm();
      this.edit = false;
      await this.cargar();
      Swal.fire('Rol asignado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al asignar el rol');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: UsuarioRol) {
    const result = await Swal.fire({
      title: 'Eliminar asignacion',
      text: 'Se eliminara la asignacion seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteUsuarioRol(item.id);
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
