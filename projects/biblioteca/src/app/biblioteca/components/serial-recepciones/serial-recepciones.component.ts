import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Ejemplar, SerialNumero, SerialRecepcion } from '../../models/biblioteca.models';

@Component({
  selector: 'app-serial-recepciones',
  templateUrl: './serial-recepciones.component.html',
  styleUrls: ['./serial-recepciones.component.css']
})
export class SerialRecepcionesComponent implements OnInit {
  recepciones: SerialRecepcion[] = [];
  numeros: SerialNumero[] = [];
  ejemplares: Ejemplar[] = [];
  recepcion: SerialRecepcion = {
    id: 0,
    serialNumeroId: 0,
    ejemplarId: undefined,
    fechaRecepcion: '',
    estado: 'recibido'
  };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.numeros = await this.dataService.getSerialNumeros();
    this.ejemplares = await this.dataService.getEjemplares();
    this.recepciones = await this.dataService.getSerialRecepciones();
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
    this.recepcion = {
      id: 0,
      serialNumeroId: 0,
      ejemplarId: undefined,
      fechaRecepcion: '',
      estado: 'recibido'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: SerialRecepcion) {
    this.recepcion = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.recepcion.serialNumeroId) {
      Swal.fire('Seleccione el numero');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateSerialRecepcion(this.recepcion);
        Swal.fire('Recepcion actualizada');
      } else {
        await this.dataService.createSerialRecepcion(this.recepcion);
        Swal.fire('Recepcion creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la recepcion');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: SerialRecepcion) {
    const result = await Swal.fire({
      title: 'Eliminar recepcion',
      text: 'Se eliminara la recepcion seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteSerialRecepcion(item.id);
      await this.cargar();
      if (this.esEdicion && this.recepcion.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Recepcion eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la recepcion');
    }
  }
}
