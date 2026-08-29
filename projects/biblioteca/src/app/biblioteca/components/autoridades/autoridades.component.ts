import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Autor, Autoridad } from '../../models/biblioteca.models';

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

  autorBuscador = '';
  resultadosBusquedaAutor: Autor[] = [];

  etiquetaBuscador = '';
  resultadosBusquedaEtiqueta: Autoridad[] = [];
  buscandoPorEtiqueta = false;

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
    this.autorBuscador = '';
    this.resultadosBusquedaAutor = [];
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Autoridad) {
    this.autoridad = { ...item };
    this.esEdicion = true;
    this.edit = true;
    this.autorBuscador = item.autorNombre || '';
    this.resultadosBusquedaAutor = [];
  }

  async buscarAutor() {
    if (!this.autorBuscador || this.autorBuscador.trim().length < 2) {
      this.resultadosBusquedaAutor = [];
      return;
    }
    this.resultadosBusquedaAutor = await this.dataService.buscarAutores(this.autorBuscador);
  }

  async vincularAutor(autor: Autor) {
    this.autorBuscador = autor.nombre;
    this.resultadosBusquedaAutor = [];

    if (this.autoridad.autorId === autor.id) {
      return;
    }

    const existente = await this.dataService.getAutoridadPorAutor(autor.id);
    if (existente && existente.id !== this.autoridad.id) {
      const resultado = await Swal.fire({
        title: 'Este autor ya tiene una autoridad',
        html: `<b>${existente.encabezado}</b> ya está vinculada a este autor.<br>¿Deseas editar esa autoridad en vez de vincular una nueva?`,
        showCancelButton: true,
        confirmButtonText: 'Editar la existente',
        cancelButtonText: 'Vincular igual'
      });
      if (resultado.isConfirmed) {
        this.editar(existente);
        return;
      }
    }

    this.autoridad.autorId = autor.id;
    this.autoridad.autorNombre = autor.nombre;
  }

  desvincularAutor() {
    this.autoridad.autorId = undefined;
    this.autoridad.autorNombre = '';
    this.autorBuscador = '';
  }

  async buscarPorEtiqueta() {
    const texto = this.etiquetaBuscador.trim();
    if (texto.length < 2) {
      this.resultadosBusquedaEtiqueta = [];
      this.buscandoPorEtiqueta = false;
      return;
    }
    this.buscandoPorEtiqueta = true;
    this.resultadosBusquedaEtiqueta = await this.dataService.buscarAutoridadPorEtiqueta(texto);
    this.buscandoPorEtiqueta = false;
  }

  limpiarBusquedaEtiqueta() {
    this.etiquetaBuscador = '';
    this.resultadosBusquedaEtiqueta = [];
    this.buscandoPorEtiqueta = false;
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
