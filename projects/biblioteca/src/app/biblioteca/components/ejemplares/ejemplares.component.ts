import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Ejemplar, Libro } from '../../models/biblioteca.models';

@Component({
  selector: 'app-ejemplares',
  templateUrl: './ejemplares.component.html',
  styleUrls: ['./ejemplares.component.css']
})
export class EjemplaresComponent implements OnInit {
  ejemplares: Ejemplar[] = [];
  libros: Libro[] = [];
  ejemplar: Ejemplar = {
    id: 0,
    libroId: 0,
    tipoSoporte: 'fisico',
    estado: 'disponible'
  };
  esEdicion = false;
  edit = false;
  searchField = '';
  archivoSeleccionado: File | null = null;
  canViewArchivo = false;
  canUploadArchivo = false;

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    this.canViewArchivo = await this.dataService.hasPermiso('biblioteca.archivo.ver');
    this.canUploadArchivo = await this.dataService.hasPermiso('biblioteca.archivo.subir');
    await this.cargar();
  }

  async cargar() {
    this.libros = await this.dataService.getLibros();
    this.ejemplares = await this.dataService.getEjemplares();
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
    this.ejemplar = {
      id: 0,
      libroId: 0,
      tipoSoporte: 'fisico',
      estado: 'disponible'
    };
    this.esEdicion = false;
    this.archivoSeleccionado = null;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: Ejemplar) {
    this.ejemplar = { ...item };
    this.esEdicion = true;
    this.edit = true;
    this.archivoSeleccionado = null;
  }

  async guardar() {
    if (!this.ejemplar.libroId) {
      Swal.fire('Seleccione un libro');
      return;
    }

    try {
      if (this.archivoSeleccionado) {
        if (!this.canUploadArchivo) {
          Swal.fire('No tiene permiso para subir archivos');
          return;
        }
        const formData = new FormData();
        formData.append('archivo', this.archivoSeleccionado);
        formData.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
        formData.append('Modulo', 'biblioteca');
        const resp = await this.dataService.subirArchivoPublico(formData);
        if (resp && resp.success === true && resp.url) {
          this.ejemplar.urlArchivo = encodeURI(resp.url);
        } else {
          Swal.fire(resp?.message || 'Error al subir archivo');
          return;
        }
      }

      if (this.esEdicion) {
        await this.dataService.updateEjemplar(this.ejemplar);
        Swal.fire('Ejemplar actualizado');
      } else {
        await this.dataService.createEjemplar(this.ejemplar);
        Swal.fire('Ejemplar creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el ejemplar');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: Ejemplar) {
    const result = await Swal.fire({
      title: 'Eliminar ejemplar',
      text: 'Se eliminara el ejemplar seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteEjemplar(item.id);
      await this.cargar();
      if (this.esEdicion && this.ejemplar.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Ejemplar eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el ejemplar');
    }
  }

  handleArchivoInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file || !input) {
      return;
    }
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      Swal.fire('Solo se permiten archivos PDF');
      input.value = '';
      return;
    }
    this.archivoSeleccionado = file;
  }

  abrirArchivo(event: Event, url?: string) {
    event.preventDefault();
    event.stopPropagation();
    if (!url) return;
    window.open(url, '_blank');
  }
}
