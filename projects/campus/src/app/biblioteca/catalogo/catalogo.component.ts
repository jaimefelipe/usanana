import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogoService } from './catalogo.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {

  esAccesoAbierto(licencia?: string): boolean {
    return licencia === 'CC-BY' || licencia === 'CC-BY-SA';
  }

  termino = '';
  categoriaSeleccionada = 0;
  categorias = [];
  libros = [];
  cargando = false;
  buscado = false;

  constructor(private catService: CatalogoService, private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('Id_Empresa') || !localStorage.getItem('Id_Usuario')) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarCategorias();
    this.buscar();
  }

  async cargarCategorias() {
    const res = await this.catService.listarCategorias();
    this.categorias = res?.['data'] || [];
  }

  async buscar() {
    this.cargando = true;
    this.buscado = false;
    const res = await this.catService.buscarLibros(this.termino, this.categoriaSeleccionada);
    this.libros = res?.['data'] || [];
    this.cargando = false;
    this.buscado = true;
  }

  limpiar() {
    this.termino = '';
    this.categoriaSeleccionada = 0;
    this.buscar();
  }

  verDetalle(libro: any) {
    localStorage.setItem('Id_Libro', libro.Id_Libro);
    this.router.navigate(['/biblioteca/libro']);
  }

  irMiCuenta() {
    this.router.navigate(['/biblioteca/mi-cuenta']);
  }
}
