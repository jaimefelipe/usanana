import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Serial, SerialNumero } from '../../models/biblioteca.models';

@Component({
  selector: 'app-serial-numeros',
  templateUrl: './serial-numeros.component.html',
  styleUrls: ['./serial-numeros.component.css']
})
export class SerialNumerosComponent implements OnInit {
  numeros: SerialNumero[] = [];
  seriales: Serial[] = [];
  numero: SerialNumero = {
    id: 0,
    serialId: 0,
    volumen: '',
    numero: '',
    fechaPrevista: '',
    fechaRecibido: '',
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
    this.seriales = await this.dataService.getSeriales();
    this.numeros = await this.dataService.getSerialNumeros();
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
    this.numero = {
      id: 0,
      serialId: 0,
      volumen: '',
      numero: '',
      fechaPrevista: '',
      fechaRecibido: '',
      estado: 'pendiente'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: SerialNumero) {
    this.numero = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.numero.serialId) {
      Swal.fire('Seleccione el serial');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateSerialNumero(this.numero);
        Swal.fire('Numero actualizado');
      } else {
        await this.dataService.createSerialNumero(this.numero);
        Swal.fire('Numero creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el numero');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: SerialNumero) {
    const result = await Swal.fire({
      title: 'Eliminar numero',
      text: 'Se eliminara el numero seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteSerialNumero(item.id);
      await this.cargar();
      if (this.esEdicion && this.numero.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Numero eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el numero');
    }
  }
}
