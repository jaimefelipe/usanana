import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { PoliticaPrestamo, TipoMaterial } from '../../models/biblioteca.models';

@Component({
  selector: 'app-politicas-prestamo',
  templateUrl: './politicas-prestamo.component.html',
  styleUrls: ['./politicas-prestamo.component.css']
})
export class PoliticasPrestamoComponent implements OnInit {
  politicas: PoliticaPrestamo[] = [];
  tiposMaterial: TipoMaterial[] = [];
  politica: PoliticaPrestamo = {
    id: 0,
    tipoUsuario: 'alumno',
    tipoMaterialId: 0,
    diasPrestamo: 7,
    maxRenovaciones: 1,
    maxPrestamos: 3,
    multaDiaria: 0
  };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.tiposMaterial = await this.dataService.getTiposMaterial();
    this.politicas = await this.dataService.getPoliticasPrestamo();
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
    this.politica = {
      id: 0,
      tipoUsuario: 'alumno',
      tipoMaterialId: 0,
      diasPrestamo: 7,
      maxRenovaciones: 1,
      maxPrestamos: 3,
      multaDiaria: 0
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: PoliticaPrestamo) {
    this.politica = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.politica.tipoUsuario || !this.politica.tipoMaterialId) {
      Swal.fire('Complete el tipo de usuario y el tipo de material');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updatePoliticaPrestamo(this.politica);
        Swal.fire('Politica actualizada');
      } else {
        await this.dataService.createPoliticaPrestamo(this.politica);
        Swal.fire('Politica creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la politica');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: PoliticaPrestamo) {
    const result = await Swal.fire({
      title: 'Eliminar politica',
      text: 'Se eliminara la politica seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deletePoliticaPrestamo(item.id);
      await this.cargar();
      if (this.esEdicion && this.politica.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Politica eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la politica');
    }
  }
}
