import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Autor, Categoria, Editorial, Libro, TipoMaterial, esAccesoAbierto } from '../../models/biblioteca.models';

@Component({
  selector: 'app-catalogo-libros',
  templateUrl: './catalogo-libros.component.html',
  styleUrls: ['./catalogo-libros.component.css']
})
export class CatalogoLibrosComponent implements OnInit {
  esAccesoAbierto = esAccesoAbierto;
  searchField = '';
  estado = 'todos';
  categoriaFiltro = 'todos';
  tipoMaterialFiltro = 'todos';
  libros: Libro[] = [];
  categorias: Categoria[] = [];
  tiposMaterial: TipoMaterial[] = [];
  editoriales: Editorial[] = [];
  libro: Libro = {
    id: 0,
    titulo: '',
    subtitulo: '',
    autor: '',
    autores: '',
    autoresSeleccionados: [],
    isbn: '',
    issn: '',
    doi: '',
    categoria: '',
    editorial: '',
    tipoMaterial: '',
    estado: 'disponible',
    idioma: '',
    anioPublicacion: undefined,
    edicion: '',
    descripcion: '',
    palabrasClave: '',
    urlPublica: '',
    categoriaId: undefined,
    editorialId: undefined,
    tipoMaterialId: undefined
  };
  edit = false;
  esEdicion = false;

  autorBuscador = '';
  autorRolSeleccionado = 'Autor';
  rolesAutor = ['Autor', 'Coautor', 'Editor', 'Traductor', 'Ilustrador'];
  resultadosBusquedaAutor: Autor[] = [];

  constructor(
    private dataService: BibliotecaDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  private borradorKey(): string {
    return 'biblioteca_borrador_libro_' + (this.libro.id || 'nuevo');
  }

  private guardarBorrador() {
    try {
      sessionStorage.setItem(this.borradorKey(), JSON.stringify({ savedAt: Date.now(), data: this.libro }));
    } catch {
      // sessionStorage no disponible: se pierde el autoguardado pero no interrumpe la edicion.
    }
  }

  private limpiarBorrador() {
    sessionStorage.removeItem(this.borradorKey());
  }

  private async ofrecerRecuperarBorrador() {
    let borrador: { savedAt: number; data: Libro } | null = null;
    try {
      const raw = sessionStorage.getItem(this.borradorKey());
      borrador = raw ? JSON.parse(raw) : null;
    } catch {
      borrador = null;
    }
    if (!borrador?.data) {
      return;
    }
    if (JSON.stringify(borrador.data) === JSON.stringify(this.libro)) {
      this.limpiarBorrador();
      return;
    }
    const resultado = await Swal.fire({
      title: 'Hay un borrador sin guardar',
      text: 'Se encontraron cambios sin guardar para este libro. Deseas recuperarlos?',
      showCancelButton: true,
      confirmButtonText: 'Recuperar borrador',
      cancelButtonText: 'Descartar'
    });
    if (resultado.isConfirmed) {
      this.libro = { ...borrador.data };
    } else {
      this.limpiarBorrador();
    }
  }

  async ngOnInit() {
    await this.cargarListas();
    await this.cargarLibros();

    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        void this.editarPorId(Number(idParam));
        return;
      }

      if (this.router.url.includes('/catalogo/nuevo')) {
        this.nuevo();
        return;
      }

      this.edit = false;
      this.esEdicion = false;
    });
  }

  async cargarListas() {
    const [categorias, tiposMaterial, editoriales] = await Promise.all([
      this.dataService.getCategorias(),
      this.dataService.getTiposMaterial(),
      this.dataService.getEditoriales()
    ]);
    this.categorias = categorias;
    this.tiposMaterial = tiposMaterial;
    this.editoriales = editoriales;
  }

  async cargarLibros() {
    this.libros = await this.dataService.getLibros();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.searchField = this.searchField.trim();
  }

  get librosFiltrados(): Libro[] {
    const termino = this.searchField.trim().toLowerCase();
    return this.libros.filter(libro => {
      const autoresTexto = (libro.autores || libro.autor || '').toLowerCase();
      const isbnTexto = (libro.isbn || '').toLowerCase();
      const coincideTexto = termino === '' ||
        libro.titulo.toLowerCase().includes(termino) ||
        autoresTexto.includes(termino) ||
        isbnTexto.includes(termino);
      const coincideEstado = this.estado === 'todos' || libro.estado === this.estado;
      const coincideCategoria =
        this.categoriaFiltro === 'todos' || String(libro.categoriaId) === this.categoriaFiltro;
      const coincideTipo =
        this.tipoMaterialFiltro === 'todos' || String(libro.tipoMaterialId) === this.tipoMaterialFiltro;
      return coincideTexto && coincideEstado && coincideCategoria && coincideTipo;
    });
  }

  resetForm() {
    this.libro = {
      id: 0,
      titulo: '',
      subtitulo: '',
      autor: '',
      autores: '',
      autoresSeleccionados: [],
      isbn: '',
      issn: '',
      doi: '',
      categoria: '',
      editorial: '',
      tipoMaterial: '',
      estado: 'disponible',
      idioma: '',
      anioPublicacion: undefined,
      edicion: '',
      descripcion: '',
      palabrasClave: '',
      urlPublica: '',
      categoriaId: undefined,
      editorialId: undefined,
      tipoMaterialId: undefined
    };
    this.esEdicion = false;
  }

  async nuevo() {
    this.resetForm();
    this.edit = true;
    await this.ofrecerRecuperarBorrador();
  }

  async editar(item: Libro) {
    this.libro = { ...item, autoresSeleccionados: [] };
    this.libro.autoresSeleccionados = await this.dataService.getAutoresPorLibro(item.id);
    this.esEdicion = true;
    this.edit = true;
    await this.ofrecerRecuperarBorrador();
  }

  async editarPorId(id: number) {
    const libro = this.libros.find(item => item.id === id) || await this.dataService.getLibroById(id);
    if (!libro) return;

    this.libro = { ...libro, autoresSeleccionados: [] };
    this.libro.autoresSeleccionados = await this.dataService.getAutoresPorLibro(libro.id);
    this.esEdicion = true;
    this.edit = true;
    await this.ofrecerRecuperarBorrador();
  }

  async buscarAutor() {
    if (!this.autorBuscador || this.autorBuscador.trim().length < 2) {
      this.resultadosBusquedaAutor = [];
      return;
    }
    this.resultadosBusquedaAutor = await this.dataService.buscarAutores(this.autorBuscador);
  }

  agregarAutor(autor: Autor) {
    const seleccionados = this.libro.autoresSeleccionados || (this.libro.autoresSeleccionados = []);
    const yaAgregado = seleccionados.find(a => a.id === autor.id);
    if (!yaAgregado) {
      seleccionados.push({ id: autor.id, nombre: autor.nombre, rol: this.autorRolSeleccionado });
    }
    this.autorBuscador = '';
    this.resultadosBusquedaAutor = [];
    this.onFormularioLibroCambio();
  }

  quitarAutor(index: number) {
    this.libro.autoresSeleccionados?.splice(index, 1);
    this.onFormularioLibroCambio();
  }

  onFormularioLibroCambio() {
    if (this.edit) {
      this.guardarBorrador();
    }
  }

  async guardar() {
    if (!this.libro.titulo || !this.libro.tipoMaterialId) {
      Swal.fire('Complete el titulo y el tipo de material');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateLibro(this.libro);
        await this.dataService.saveLibroAutores(this.libro.id, this.libro.autoresSeleccionados || []);
        Swal.fire('Libro actualizado');
      } else {
        const libroId = await this.dataService.createLibro(this.libro);
        if (!libroId) {
          Swal.fire('No se pudo obtener el id del libro');
          return;
        }
        await this.dataService.saveLibroAutores(libroId, this.libro.autoresSeleccionados || []);
        Swal.fire('Libro creado');
      }
      this.limpiarBorrador();
      await this.cargarLibros();
      this.resetForm();
      this.edit = false;
      if (this.router.url !== '/catalogo') {
        this.router.navigate(['/catalogo']);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el libro');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
    if (this.router.url !== '/catalogo') {
      this.router.navigate(['/catalogo']);
    }
  }
}
