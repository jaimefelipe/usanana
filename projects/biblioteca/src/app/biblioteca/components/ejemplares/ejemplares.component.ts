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
  imagenSeleccionada: File | null = null;
  imagenPreviewUrl: string | null = null;
  canViewArchivo = false;
  canUploadArchivo = false;
  PantallaLibros = false;
  libroSearchField = '';
  libroPage = 1;
  libroPageSize = 12;
  libroTotal = 0;
  libroLoading = false;
  libroSeleccionadoTexto = '';

  page = 1;
  pageSize = 50;
  total = 0;
  totalPdf = 0;
  loading = false;

  constructor(private dataService: BibliotecaDataService) {}

  get archivoSeleccionadoNombre(): string {
    return this.archivoSeleccionado?.name || '';
  }

  async ngOnInit() {
    this.canViewArchivo = await this.dataService.hasPermiso('biblioteca.archivo.ver');
    this.canUploadArchivo = await this.dataService.hasPermiso('biblioteca.archivo.subir');
    await this.cargar();
    this.totalPdf = await this.dataService.countEjemplaresPdf();
  }

  async cargar(resetPage = false) {
    if (resetPage) {
      this.page = 1;
    }
    this.loading = true;
    try {
      const resultado = await this.dataService.getEjemplaresPage(this.page, this.pageSize, this.searchField);
      this.ejemplares = resultado.ejemplares;
      this.total = resultado.total;
      const totalPages = this.totalPages;
      if (totalPages > 0 && this.page > totalPages) {
        this.page = totalPages;
        await this.cargar();
      }
    } finally {
      this.loading = false;
    }
  }

  get totalPages() {
    return this.total > 0 ? Math.ceil(this.total / this.pageSize) : 0;
  }

  get pageNumbers() {
    const total = this.totalPages;
    if (total <= 0) {
      return [];
    }
    const start = Math.max(1, this.page - 2);
    const end = Math.min(total, start + 4);
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  get rangeStart() {
    return this.total === 0 ? 0 : ((this.page - 1) * this.pageSize) + 1;
  }

  get rangeEnd() {
    return Math.min(this.page * this.pageSize, this.total);
  }

  async cambiarPagina(page: number) {
    const totalPages = this.totalPages;
    if (page < 1 || (totalPages > 0 && page > totalPages) || page === this.page) {
      return;
    }
    this.page = page;
    await this.cargar();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  async search() {
    this.searchField = this.searchField.trim();
    await this.cargar(true);
  }

  private limpiarSeleccionImagen() {
    if (this.imagenPreviewUrl) {
      URL.revokeObjectURL(this.imagenPreviewUrl);
    }
    this.imagenSeleccionada = null;
    this.imagenPreviewUrl = null;
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
    this.limpiarSeleccionImagen();
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
    this.limpiarSeleccionImagen();
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

      if (this.imagenSeleccionada) {
        const formDataImagen = new FormData();
        formDataImagen.append('archivo', this.imagenSeleccionada);
        formDataImagen.append('Id_Empresa', localStorage.getItem('Id_Empresa') || '');
        formDataImagen.append('Modulo', 'biblioteca');
        const respImagen = await this.dataService.subirArchivoPublico(formDataImagen);
        if (respImagen && respImagen.success === true && respImagen.url) {
          this.ejemplar.imagenPortada = encodeURI(respImagen.url);
        } else {
          Swal.fire(respImagen?.message || 'Error al subir la imagen de portada');
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
      this.totalPdf = await this.dataService.countEjemplaresPdf();
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
      this.totalPdf = await this.dataService.countEjemplaresPdf();
      if (this.esEdicion && this.ejemplar.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Ejemplar eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el ejemplar');
    }
  }

  onImagenPortadaSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file || !input) return;
    if (!file.type.startsWith('image/')) {
      if (this.esArchivoDigitalPermitido(file)) {
        this.setArchivoDigital(file);
        Swal.fire('Archivo digital seleccionado', 'El archivo se subira como recurso digital. La portada debe ser una imagen.', 'info');
      } else {
        Swal.fire('Archivo no permitido', 'La portada debe ser imagen. Para el recurso digital use PDF o Word.', 'warning');
      }
      input.value = '';
      return;
    }
    this.limpiarSeleccionImagen();
    this.imagenSeleccionada = file;
    this.imagenPreviewUrl = URL.createObjectURL(file);
  }

  private esArchivoDigitalPermitido(file: File): boolean {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return ['pdf', 'doc', 'docx'].includes(extension || '');
  }

  private setArchivoDigital(file: File) {
    this.archivoSeleccionado = file;
    this.ejemplar.tipoSoporte = 'digital';
  }

  handleArchivoInput(event: Event) {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file || !input) {
      return;
    }
    if (!this.esArchivoDigitalPermitido(file)) {
      Swal.fire('Archivo no permitido', 'Solo se permiten archivos PDF o Word (.doc, .docx).', 'warning');
      input.value = '';
      return;
    }
    this.setArchivoDigital(file);
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
