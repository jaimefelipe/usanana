import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, Tesis } from '../../models/biblioteca.models';

@Component({
  selector: 'app-tesis',
  templateUrl: './tesis.component.html',
  styleUrls: ['./tesis.component.css']
})
export class TesisComponent implements OnInit {
  tesis: Tesis[] = [];
  libros: Libro[] = [];
  registro: Tesis = {
    id: 0,
    libroId: 0,
    universidad: '',
    facultad: '',
    carrera: '',
    tutor: '',
    autorInstitucional: '',
    fechaDefensa: ''
  };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.libros = await this.dataService.getLibros();
    this.tesis = await this.dataService.getTesis();
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
    this.registro = {
      id: 0,
      libroId: 0,
      universidad: '',
      facultad: '',
      carrera: '',
      tutor: '',
      autorInstitucional: '',
      fechaDefensa: ''
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Tesis) {
    this.registro = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.registro.libroId) {
      Swal.fire('Seleccione el libro');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateTesis(this.registro);
        Swal.fire('Tesis actualizada');
      } else {
        await this.dataService.createTesis(this.registro);
        Swal.fire('Tesis creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la tesis');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Tesis) {
    const result = await Swal.fire({
      title: 'Eliminar tesis',
      text: 'Se eliminara la tesis seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteTesis(item.id);
      await this.cargar();
      if (this.esEdicion && this.registro.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Tesis eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la tesis');
    }
  }
}
