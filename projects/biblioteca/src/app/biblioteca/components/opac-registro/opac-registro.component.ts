import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { UsuarioBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-registro',
  templateUrl: './opac-registro.component.html',
  styleUrls: ['./opac-registro.component.css']
})
export class OpacRegistroComponent {
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

  constructor(private dataService: BibliotecaDataService) {}

  async registrar() {
    if (!this.usuario.nombre || !this.usuario.email) {
      Swal.fire('Complete nombre y email');
      return;
    }

    try {
      await this.dataService.createUsuarioBiblioteca(this.usuario);
      Swal.fire('Registro creado');
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
    } catch (error) {
      console.error(error);
      Swal.fire('Error al registrar');
    }
  }
}
