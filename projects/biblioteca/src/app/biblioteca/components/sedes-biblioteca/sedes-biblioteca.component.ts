import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { SedeBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-sedes-biblioteca',
  templateUrl: './sedes-biblioteca.component.html',
  styleUrls: ['./sedes-biblioteca.component.css']
})
export class SedesBibliotecaComponent implements OnInit {
  sedes: SedeBiblioteca[] = [];
  sede: SedeBiblioteca = {
    id: 0,
    nombre: '',
    codigo: '',
    direccion: '',
    telefono: '',
    estado: 'activo'
  };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.sedes = await this.dataService.getSedes();
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
    this.sede = {
      id: 0,
      nombre: '',
      codigo: '',
      direccion: '',
      telefono: '',
      estado: 'activo'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: SedeBiblioteca) {
    this.sede = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.sede.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateSede(this.sede);
        Swal.fire('Sede actualizada');
      } else {
        await this.dataService.createSede(this.sede);
        Swal.fire('Sede creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la sede');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: SedeBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar sede',
      text: 'Se eliminara la sede seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteSede(item.id);
      await this.cargar();
      if (this.esEdicion && this.sede.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Sede eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la sede');
    }
  }
}
