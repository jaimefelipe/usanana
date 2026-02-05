import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { PresupuestoBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-presupuestos',
  templateUrl: './presupuestos.component.html',
  styleUrls: ['./presupuestos.component.css']
})
export class PresupuestosComponent implements OnInit {
  presupuestos: PresupuestoBiblioteca[] = [];
  presupuesto: PresupuestoBiblioteca = {
    id: 0,
    nombre: '',
    anio: new Date().getFullYear(),
    monto: 0,
    saldo: 0,
    estado: 'activo'
  };
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    this.presupuestos = await this.dataService.getPresupuestos();
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
    this.presupuesto = {
      id: 0,
      nombre: '',
      anio: new Date().getFullYear(),
      monto: 0,
      saldo: 0,
      estado: 'activo'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: PresupuestoBiblioteca) {
    this.presupuesto = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.presupuesto.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updatePresupuesto(this.presupuesto);
        Swal.fire('Presupuesto actualizado');
      } else {
        await this.dataService.createPresupuesto(this.presupuesto);
        Swal.fire('Presupuesto creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el presupuesto');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: PresupuestoBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar presupuesto',
      text: 'Se eliminara el presupuesto seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deletePresupuesto(item.id);
      await this.cargar();
      if (this.esEdicion && this.presupuesto.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Presupuesto eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el presupuesto');
    }
  }
}
