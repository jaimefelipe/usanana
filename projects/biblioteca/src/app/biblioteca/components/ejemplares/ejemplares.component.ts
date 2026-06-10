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
  librosBusqueda: Libro[] = [];
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
  PantallaLibros = false;
  libroSearchField = '';
  libroPage = 1;
  libroPageSize = 12;
  libroTotal = 0;
  libroLoading = false;
  libroSeleccionadoTexto = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    this.canViewArchivo = await this.dataService.hasPermiso('biblioteca.archivo.ver');
    this.canUploadArchivo = await this.dataService.hasPermiso('biblioteca.archivo.subir');
    await this.cargar();
  }

  async cargar() {
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
    this.libroSeleccionadoTexto = '';
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
    this.libroSeleccionadoTexto = this.getLibroTexto(item);
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

  async abrirSelectorLibros() {
    this.PantallaLibros = true;
    this.libroSearchField = this.libroSeleccionadoTexto;
    await this.cargarLibrosBusqueda(true);
  }

  cerrarSelectorLibros() {
    this.PantallaLibros = false;
  }

  async buscarLibrosPopup() {
    await this.cargarLibrosBusqueda(true);
  }

  async keytabLibros(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      await this.buscarLibrosPopup();
    }
  }

  async ChangePageLibros(direction: number) {
    const nextPage = this.libroPage + direction;
    if (nextPage < 1 || nextPage > this.totalPaginasLibros()) {
      return;
    }
    this.libroPage = nextPage;
    await this.cargarLibrosBusqueda(false);
  }

  seleccionarLibro(libro: Libro) {
    this.ejemplar.libroId = libro.id;
    this.ejemplar.libroTitulo = libro.titulo;
    this.libroSeleccionadoTexto = this.getLibroTexto({
      id: 0,
      libroId: libro.id,
      libroTitulo: libro.titulo,
      tipoSoporte: 'fisico',
      estado: 'disponible'
    });
    this.cerrarSelectorLibros();
  }

  totalPaginasLibros(): number {
    return Math.max(1, Math.ceil(this.libroTotal / this.libroPageSize));
  }

  private async cargarLibrosBusqueda(resetPage: boolean) {
    if (resetPage) {
      this.libroPage = 1;
    }
    this.libroLoading = true;
    try {
      const response = await this.dataService.getLibrosPage(
        this.libroPage,
        this.libroPageSize,
        this.libroSearchField.trim()
      );
      this.librosBusqueda = response.libros;
      this.libroTotal = response.total;
    } catch (error) {
      console.error(error);
      Swal.fire('Error al buscar libros');
    } finally {
      this.libroLoading = false;
    }
  }

  private getLibroTexto(item: Ejemplar): string {
    if (!item.libroId) {
      return '';
    }
    return item.libroTitulo || `Libro ${item.libroId}`;
  }
}
