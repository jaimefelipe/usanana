import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, OpacLista, OpacListaItem } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-lista-items',
  templateUrl: './opac-lista-items.component.html',
  styleUrls: ['./opac-lista-items.component.css']
})
export class OpacListaItemsComponent implements OnInit {
  items: OpacListaItem[] = [];
  listas: OpacLista[] = [];
  libros: Libro[] = [];
  item: OpacListaItem = { id: 0, listaId: 0, libroId: 0 };
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.listas = await this.dataService.getOpacListas();
    this.libros = await this.dataService.getLibros();
    this.items = await this.dataService.getOpacListaItems();
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
    this.item = { id: 0, listaId: 0, libroId: 0 };
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  async guardar() {
    if (!this.item.listaId || !this.item.libroId) {
      Swal.fire('Complete lista y libro');
      return;
    }

    try {
      await this.dataService.createOpacListaItem(this.item);
      this.resetForm();
      this.edit = false;
      await this.cargar();
      Swal.fire('Item agregado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al agregar el item');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: OpacListaItem) {
    const result = await Swal.fire({
      title: 'Eliminar item',
      text: 'Se eliminara el item seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteOpacListaItem(item.id);
      await this.cargar();
      if (this.item.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Item eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el item');
    }
  }
}
