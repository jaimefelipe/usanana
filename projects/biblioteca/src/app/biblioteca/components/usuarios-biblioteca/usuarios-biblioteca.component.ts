import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { UsuarioBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-usuarios-biblioteca',
  templateUrl: './usuarios-biblioteca.component.html',
  styleUrls: ['./usuarios-biblioteca.component.css']
})
export class UsuariosBibliotecaComponent implements OnInit {
  usuarios: UsuarioBiblioteca[] = [];
  usuario: UsuarioBiblioteca = {
    id: 0,
    nombre: '',
    bloqueado: false,
    prestamosActivos: 0,
    multasPendientes: 0,
    codigoUniversitario: '',
    email: '',
    telefono: '',
    tipoUsuario: 'alumno',
    multaAcumulada: 0
  };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.usuarios = await this.dataService.getUsuarios();
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
    this.usuario = {
      id: 0,
      nombre: '',
      bloqueado: false,
      prestamosActivos: 0,
      multasPendientes: 0,
      codigoUniversitario: '',
      email: '',
      telefono: '',
      tipoUsuario: 'alumno',
      multaAcumulada: 0
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: UsuarioBiblioteca) {
    this.usuario = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.usuario.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateUsuarioBiblioteca(this.usuario);
        Swal.fire('Usuario actualizado');
      } else {
        await this.dataService.createUsuarioBiblioteca(this.usuario);
        Swal.fire('Usuario creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el usuario');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: UsuarioBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar usuario',
      text: 'Se eliminara el usuario seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteUsuarioBiblioteca(item.id);
      await this.cargar();
      if (this.esEdicion && this.usuario.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Usuario eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el usuario');
    }
  }
}
