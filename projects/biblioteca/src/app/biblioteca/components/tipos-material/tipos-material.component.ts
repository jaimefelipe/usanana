import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { TipoMaterial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-tipos-material',
  templateUrl: './tipos-material.component.html',
  styleUrls: ['./tipos-material.component.css']
})
export class TiposMaterialComponent implements OnInit {
  tipos: TipoMaterial[] = [];
  tipo: TipoMaterial = { id: 0, nombre: '', descripcion: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.tipos = await this.dataService.getTiposMaterial();
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
    this.tipo = { id: 0, nombre: '', descripcion: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: TipoMaterial) {
    this.tipo = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.tipo.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateTipoMaterial(this.tipo);
        Swal.fire('Tipo de material actualizado');
      } else {
        await this.dataService.createTipoMaterial(this.tipo);
        Swal.fire('Tipo de material creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el tipo de material');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: TipoMaterial) {
    const result = await Swal.fire({
      title: 'Eliminar tipo de material',
      text: 'Se eliminara el tipo de material seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteTipoMaterial(item.id);
      await this.cargar();
      if (this.esEdicion && this.tipo.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Tipo de material eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el tipo de material');
    }
  }
}
