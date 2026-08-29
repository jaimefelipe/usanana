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
  relacion: UsuarioRol = { id: 0, usuarioId: 0, rolId: 0 };
  edit = false;
  searchField = '';
  modalUsuarios = false;
  searchUsuarioField = '';

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

  get usuarioSeleccionadoNombre(): string {
    const usuario = this.usuarios.find(item => item.id === this.relacion.usuarioId);
    return usuario ? usuario.nombre : '';
  }

  get usuariosFiltrados(): UsuarioBiblioteca[] {
    const texto = this.searchUsuarioField.trim().toLowerCase();
    if (!texto) return this.usuarios;
    return this.usuarios.filter(usuario =>
      (usuario.nombre || '').toLowerCase().includes(texto) ||
      (usuario.email || '').toLowerCase().includes(texto) ||
      (usuario.codigoUniversitario || '').toLowerCase().includes(texto)
    );
  }

  abrirSelectorUsuarios() {
    this.searchUsuarioField = '';
    this.modalUsuarios = true;
  }

  cerrarSelectorUsuarios() {
    this.modalUsuarios = false;
  }

  seleccionarUsuario(usuario: UsuarioBiblioteca) {
    this.relacion.usuarioId = usuario.id;
    this.modalUsuarios = false;
  }

  resetForm() {
    this.relacion = { id: 0, usuarioId: 0, rolId: 0 };
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
    if (!this.relacion.usuarioId || !this.relacion.rolId) {
      Swal.fire('Seleccione usuario y rol');
      return;
    }

    try {
      const esEdicion = this.relacion.id > 0;
      if (esEdicion) {
        await this.dataService.updateUsuarioRol(this.relacion);
      } else {
        await this.dataService.createUsuarioRol(this.relacion);
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
      Swal.fire(esEdicion ? 'Rol actualizado' : 'Rol asignado');
    } catch (error) {
      console.error(error);
      const mensaje = error instanceof Error ? error.message : 'Error al asignar el rol';
      Swal.fire('Error al asignar el rol', mensaje, 'error');
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
