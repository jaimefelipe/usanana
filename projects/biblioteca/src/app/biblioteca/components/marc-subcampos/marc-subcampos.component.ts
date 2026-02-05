import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { MarcCampo, MarcSubcampo } from '../../models/biblioteca.models';

@Component({
  selector: 'app-marc-subcampos',
  templateUrl: './marc-subcampos.component.html',
  styleUrls: ['./marc-subcampos.component.css']
})
export class MarcSubcamposComponent implements OnInit {
  subcampos: MarcSubcampo[] = [];
  campos: MarcCampo[] = [];
  subcampo: MarcSubcampo = { id: 0, marcCampoId: 0, codigo: '', valor: '' };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.campos = await this.dataService.getMarcCampos();
    this.subcampos = await this.dataService.getMarcSubcampos();
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
    this.subcampo = { id: 0, marcCampoId: 0, codigo: '', valor: '' };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: MarcSubcampo) {
    this.subcampo = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.subcampo.marcCampoId || !this.subcampo.codigo) {
      Swal.fire('Complete el campo y el codigo');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateMarcSubcampo(this.subcampo);
        Swal.fire('Subcampo actualizado');
      } else {
        await this.dataService.createMarcSubcampo(this.subcampo);
        Swal.fire('Subcampo creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el subcampo');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: MarcSubcampo) {
    const result = await Swal.fire({
      title: 'Eliminar subcampo',
      text: 'Se eliminara el subcampo seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteMarcSubcampo(item.id);
      await this.cargar();
      if (this.esEdicion && this.subcampo.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Subcampo eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el subcampo');
    }
  }
}
