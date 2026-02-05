import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, MarcRegistro } from '../../models/biblioteca.models';

@Component({
  selector: 'app-marc-registros',
  templateUrl: './marc-registros.component.html',
  styleUrls: ['./marc-registros.component.css']
})
export class MarcRegistrosComponent implements OnInit {
  registros: MarcRegistro[] = [];
  libros: Libro[] = [];
  registro: MarcRegistro = {
    id: 0,
    libroId: 0,
    formato: 'MARC21',
    leader: '',
    control001: '',
    control005: '',
    control008: ''
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
    this.registros = await this.dataService.getMarcRegistros();
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
      formato: 'MARC21',
      leader: '',
      control001: '',
      control005: '',
      control008: ''
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: MarcRegistro) {
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
        await this.dataService.updateMarcRegistro(this.registro);
        Swal.fire('Registro actualizado');
      } else {
        await this.dataService.createMarcRegistro(this.registro);
        Swal.fire('Registro creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el registro');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: MarcRegistro) {
    const result = await Swal.fire({
      title: 'Eliminar registro',
      text: 'Se eliminara el registro seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMarcRegistro(item.id);
      await this.cargar();
      if (this.esEdicion && this.registro.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Registro eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el registro');
    }
  }
}
