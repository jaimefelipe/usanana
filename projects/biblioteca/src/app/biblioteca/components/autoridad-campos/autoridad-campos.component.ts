import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Autoridad, AutoridadCampo } from '../../models/biblioteca.models';

@Component({
  selector: 'app-autoridad-campos',
  templateUrl: './autoridad-campos.component.html',
  styleUrls: ['./autoridad-campos.component.css']
})
export class AutoridadCamposComponent implements OnInit {
  campos: AutoridadCampo[] = [];
  autoridades: Autoridad[] = [];
  campo: AutoridadCampo = { id: 0, autoridadId: 0, tag: '', ind1: '', ind2: '', valor: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.autoridades = await this.dataService.getAutoridades();
    this.campos = await this.dataService.getAutoridadCampos();
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
    this.campo = { id: 0, autoridadId: 0, tag: '', ind1: '', ind2: '', valor: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: AutoridadCampo) {
    this.campo = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.campo.autoridadId || !this.campo.tag) {
      Swal.fire('Complete la autoridad y el tag');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateAutoridadCampo(this.campo);
        Swal.fire('Campo actualizado');
      } else {
        await this.dataService.createAutoridadCampo(this.campo);
        Swal.fire('Campo creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el campo');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: AutoridadCampo) {
    const result = await Swal.fire({
      title: 'Eliminar campo',
      text: 'Se eliminara el campo seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteAutoridadCampo(item.id);
      await this.cargar();
      if (this.esEdicion && this.campo.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Campo eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el campo');
    }
  }
}
