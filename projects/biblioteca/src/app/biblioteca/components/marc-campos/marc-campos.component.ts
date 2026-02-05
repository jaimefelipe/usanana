import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { MarcCampo, MarcRegistro } from '../../models/biblioteca.models';

@Component({
  selector: 'app-marc-campos',
  templateUrl: './marc-campos.component.html',
  styleUrls: ['./marc-campos.component.css']
})
export class MarcCamposComponent implements OnInit {
  campos: MarcCampo[] = [];
  registros: MarcRegistro[] = [];
  campo: MarcCampo = { id: 0, marcRegistroId: 0, tag: '', ind1: '', ind2: '', valor: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.registros = await this.dataService.getMarcRegistros();
    this.campos = await this.dataService.getMarcCampos();
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
    this.campo = { id: 0, marcRegistroId: 0, tag: '', ind1: '', ind2: '', valor: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: MarcCampo) {
    this.campo = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.campo.marcRegistroId || !this.campo.tag) {
      Swal.fire('Complete el registro y el tag');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateMarcCampo(this.campo);
        Swal.fire('Campo actualizado');
      } else {
        await this.dataService.createMarcCampo(this.campo);
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

  async eliminar(item: MarcCampo) {
    const result = await Swal.fire({
      title: 'Eliminar campo',
      text: 'Se eliminara el campo seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMarcCampo(item.id);
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
