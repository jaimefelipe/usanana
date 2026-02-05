import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Multa, UsuarioBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-multas',
  templateUrl: './multas.component.html',
  styleUrls: ['./multas.component.css']
})
export class MultasComponent implements OnInit {
  multas: Multa[] = [];
  usuarios: UsuarioBiblioteca[] = [];
  multa: Multa = {
    id: 0,
    usuarioId: 0,
    monto: 0,
    saldo: 0,
    motivo: '',
    fechaGeneracion: '',
    estado: 'pendiente'
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
    this.multas = await this.dataService.getMultas();
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
    this.multa = {
      id: 0,
      usuarioId: 0,
      monto: 0,
      saldo: 0,
      motivo: '',
      fechaGeneracion: '',
      estado: 'pendiente'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Multa) {
    this.multa = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.multa.usuarioId || !this.multa.motivo) {
      Swal.fire('Complete el usuario y el motivo');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateMulta(this.multa);
        Swal.fire('Multa actualizada');
      } else {
        await this.dataService.createMulta(this.multa);
        Swal.fire('Multa creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la multa');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Multa) {
    const result = await Swal.fire({
      title: 'Eliminar multa',
      text: 'Se eliminara la multa seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMulta(item.id);
      await this.cargar();
      if (this.esEdicion && this.multa.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Multa eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la multa');
    }
  }
}
