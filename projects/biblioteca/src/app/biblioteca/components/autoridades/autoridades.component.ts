import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Autoridad } from '../../models/biblioteca.models';

@Component({
  selector: 'app-autoridades',
  templateUrl: './autoridades.component.html',
  styleUrls: ['./autoridades.component.css']
})
export class AutoridadesComponent implements OnInit {
  autoridades: Autoridad[] = [];
  autoridad: Autoridad = { id: 0, tipo: 'autor', encabezado: '', formato: 'MARC21' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.autoridades = await this.dataService.getAutoridades();
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
    this.autoridad = { id: 0, tipo: 'autor', encabezado: '', formato: 'MARC21' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Autoridad) {
    this.autoridad = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.autoridad.encabezado) {
      Swal.fire('Complete el encabezado');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateAutoridad(this.autoridad);
        Swal.fire('Autoridad actualizada');
      } else {
        await this.dataService.createAutoridad(this.autoridad);
        Swal.fire('Autoridad creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la autoridad');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Autoridad) {
    const result = await Swal.fire({
      title: 'Eliminar autoridad',
      text: 'Se eliminara la autoridad seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteAutoridad(item.id);
      await this.cargar();
      if (this.esEdicion && this.autoridad.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Autoridad eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la autoridad');
    }
  }
}
