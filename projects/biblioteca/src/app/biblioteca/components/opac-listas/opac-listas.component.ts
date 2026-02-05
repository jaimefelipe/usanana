import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { OpacLista, UsuarioBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-listas',
  templateUrl: './opac-listas.component.html',
  styleUrls: ['./opac-listas.component.css']
})
export class OpacListasComponent implements OnInit {
  listas: OpacLista[] = [];
  usuarios: UsuarioBiblioteca[] = [];
  lista: OpacLista = { id: 0, usuarioId: 0, nombre: '', descripcion: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.usuarios = await this.dataService.getUsuarios();
    this.listas = await this.dataService.getOpacListas();
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
    this.lista = { id: 0, usuarioId: 0, nombre: '', descripcion: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: OpacLista) {
    this.lista = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.lista.usuarioId || !this.lista.nombre) {
      Swal.fire('Complete el usuario y el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateOpacLista(this.lista);
        Swal.fire('Lista actualizada');
      } else {
        await this.dataService.createOpacLista(this.lista);
        Swal.fire('Lista creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la lista');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: OpacLista) {
    const result = await Swal.fire({
      title: 'Eliminar lista',
      text: 'Se eliminara la lista seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteOpacLista(item.id);
      await this.cargar();
      if (this.esEdicion && this.lista.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Lista eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la lista');
    }
  }
}
