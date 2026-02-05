import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Autor, Categoria, Editorial, Libro, TipoMaterial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-libro-form',
  templateUrl: './libro-form.component.html',
  styleUrls: ['./libro-form.component.css']
})
export class LibroFormComponent implements OnInit {
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
  categorias: Categoria[] = [];
  editoriales: Editorial[] = [];
  autores: Autor[] = [];
  tiposMaterial: TipoMaterial[] = [];
  esEdicion = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: BibliotecaDataService
  ) {}

  async ngOnInit() {
    this.categorias = await this.dataService.getCategorias();
    this.editoriales = await this.dataService.getEditoriales();
    this.autores = await this.dataService.getAutores();
    this.tiposMaterial = await this.dataService.getTiposMaterial();

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      const libro = await this.dataService.getLibroById(Number(idParam));
      if (libro) {
        this.libro = { ...libro, autoresIds: [] };
        this.libro.autoresIds = await this.dataService.getAutoresPorLibro(libro.id);
      }
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
      this.router.navigate(['/catalogo']);
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el libro');
    }
  }

  cancelar() {
    this.router.navigate(['/catalogo']);
  }
}
