import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Serial, SuscripcionSerial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-suscripciones-serial',
  templateUrl: './suscripciones-serial.component.html',
  styleUrls: ['./suscripciones-serial.component.css']
})
export class SuscripcionesSerialComponent implements OnInit {
  suscripciones: SuscripcionSerial[] = [];
  seriales: Serial[] = [];
  suscripcion: SuscripcionSerial = {
    id: 0,
    serialId: 0,
    proveedor: '',
    fechaInicio: '',
    fechaFin: '',
    frecuencia: '',
    estado: 'activa'
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
    this.suscripciones = await this.dataService.getSuscripciones();
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
    this.suscripcion = {
      id: 0,
      serialId: 0,
      proveedor: '',
      fechaInicio: '',
      fechaFin: '',
      frecuencia: '',
      estado: 'activa'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: SuscripcionSerial) {
    this.suscripcion = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.suscripcion.serialId || !this.suscripcion.fechaInicio) {
      Swal.fire('Complete el serial y la fecha inicio');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateSuscripcion(this.suscripcion);
        Swal.fire('Suscripcion actualizada');
      } else {
        await this.dataService.createSuscripcion(this.suscripcion);
        Swal.fire('Suscripcion creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la suscripcion');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: SuscripcionSerial) {
    const result = await Swal.fire({
      title: 'Eliminar suscripcion',
      text: 'Se eliminara la suscripcion seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteSuscripcion(item.id);
      await this.cargar();
      if (this.esEdicion && this.suscripcion.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Suscripcion eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la suscripcion');
    }
  }
}
