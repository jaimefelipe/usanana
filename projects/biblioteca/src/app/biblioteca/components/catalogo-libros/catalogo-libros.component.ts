import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Autor, Categoria, Editorial, Libro, TipoMaterial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-catalogo-libros',
  templateUrl: './catalogo-libros.component.html',
  styleUrls: ['./catalogo-libros.component.css']
})
export class CatalogoLibrosComponent implements OnInit {
  searchField = '';
  estado = 'todos';
  categoriaFiltro = 'todos';
  tipoMaterialFiltro = 'todos';
  libros: Libro[] = [];
  categorias: Categoria[] = [];
  tiposMaterial: TipoMaterial[] = [];
  editoriales: Editorial[] = [];
  autores: Autor[] = [];
  libro: Libro = {
    id: 0,
    titulo: '',
    subtitulo: '',
    autor: '',
    autores: '',
    autoresIds: [],
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

  constructor(
    private dataService: BibliotecaDataService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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
    const [categorias, tiposMaterial, editoriales, autores] = await Promise.all([
      this.dataService.getCategorias(),
      this.dataService.getTiposMaterial(),
      this.dataService.getEditoriales(),
      this.dataService.getAutores()
    ]);
    this.categorias = categorias;
    this.tiposMaterial = tiposMaterial;
    this.editoriales = editoriales;
    this.autores = autores;
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
      autoresIds: [],
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

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  async editar(item: Libro) {
    this.libro = { ...item, autoresIds: [] };
    this.libro.autoresIds = await this.dataService.getAutoresPorLibro(item.id);
    this.esEdicion = true;
    this.edit = true;
  }

  async editarPorId(id: number) {
    const libro = this.libros.find(item => item.id === id) || await this.dataService.getLibroById(id);
    if (!libro) return;

    this.libro = { ...libro, autoresIds: [] };
    this.libro.autoresIds = await this.dataService.getAutoresPorLibro(libro.id);
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.libro.titulo || !this.libro.tipoMaterialId) {
      Swal.fire('Complete el titulo y el tipo de material');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateLibro(this.libro);
        await this.dataService.saveLibroAutores(this.libro.id, this.libro.autoresIds || []);
        Swal.fire('Libro actualizado');
      } else {
        const libroId = await this.dataService.createLibro(this.libro);
        if (!libroId) {
          Swal.fire('No se pudo obtener el id del libro');
          return;
        }
        await this.dataService.saveLibroAutores(libroId, this.libro.autoresIds || []);
        Swal.fire('Libro creado');
      }
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
