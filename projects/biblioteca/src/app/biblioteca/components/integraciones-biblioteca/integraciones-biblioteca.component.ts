import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { IntegracionBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-integraciones-biblioteca',
  templateUrl: './integraciones-biblioteca.component.html',
  styleUrls: ['./integraciones-biblioteca.component.css']
})
export class IntegracionesBibliotecaComponent implements OnInit {
  integraciones: IntegracionBiblioteca[] = [];
  integracion: IntegracionBiblioteca = {
    id: 0,
    tipo: 'Z39.50',
    endpoint: '',
    usuario: '',
    clave: '',
    puerto: undefined,
    estado: 'activo',
    notas: ''
  };
  tipos = ['Z39.50', 'SRU', 'OAI-PMH', 'SIP2', 'NCIP', 'Discovery', 'RFID', 'API'];
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.integraciones = await this.dataService.getIntegraciones();
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
    this.integracion = {
      id: 0,
      tipo: 'Z39.50',
      endpoint: '',
      usuario: '',
      clave: '',
      puerto: undefined,
      estado: 'activo',
      notas: ''
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: IntegracionBiblioteca) {
    this.integracion = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.integracion.tipo) {
      Swal.fire('Seleccione el tipo');
      return;
    }
    if (!this.integracion.endpoint) {
      Swal.fire('Complete el endpoint');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateIntegracion(this.integracion);
        Swal.fire('Integracion actualizada');
      } else {
        await this.dataService.createIntegracion(this.integracion);
        Swal.fire('Integracion creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la integracion');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: IntegracionBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar integracion',
      text: 'Se eliminara la integracion seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteIntegracion(item.id);
      await this.cargar();
      if (this.esEdicion && this.integracion.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Integracion eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la integracion');
    }
  }
}
