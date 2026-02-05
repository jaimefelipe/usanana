import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, Serial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-seriales',
  templateUrl: './seriales.component.html',
  styleUrls: ['./seriales.component.css']
})
export class SerialesComponent implements OnInit {
  seriales: Serial[] = [];
  libros: Libro[] = [];
  serial: Serial = { id: 0, libroId: 0, frecuencia: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.libros = await this.dataService.getLibros();
    this.seriales = await this.dataService.getSeriales();
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
    this.serial = { id: 0, libroId: 0, frecuencia: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Serial) {
    this.serial = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.serial.libroId) {
      Swal.fire('Seleccione un libro');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateSerial(this.serial);
        Swal.fire('Serial actualizado');
      } else {
        await this.dataService.createSerial(this.serial);
        Swal.fire('Serial creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el serial');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Serial) {
    const result = await Swal.fire({
      title: 'Eliminar serial',
      text: 'Se eliminara el serial seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteSerial(item.id);
      await this.cargar();
      if (this.esEdicion && this.serial.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Serial eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el serial');
    }
  }
}
