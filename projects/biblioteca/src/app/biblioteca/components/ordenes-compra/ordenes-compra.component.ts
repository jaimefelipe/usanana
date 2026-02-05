import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { OrdenCompraBiblioteca, PresupuestoBiblioteca, ProveedorBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-ordenes-compra',
  templateUrl: './ordenes-compra.component.html',
  styleUrls: ['./ordenes-compra.component.css']
})
export class OrdenesCompraComponent implements OnInit {
  ordenes: OrdenCompraBiblioteca[] = [];
  orden: OrdenCompraBiblioteca = {
    id: 0,
    proveedorId: 0,
    presupuestoId: undefined,
    fecha: this.hoy(),
    estado: 'pendiente',
    total: 0,
    observaciones: ''
  };
  proveedores: ProveedorBiblioteca[] = [];
  presupuestos: PresupuestoBiblioteca[] = [];
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    const [ordenes, proveedores, presupuestos] = await Promise.all([
      this.dataService.getOrdenesCompra(),
      this.dataService.getProveedores(),
      this.dataService.getPresupuestos()
    ]);
    this.ordenes = ordenes;
    this.proveedores = proveedores;
    this.presupuestos = presupuestos;
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
    this.orden = {
      id: 0,
      proveedorId: 0,
      presupuestoId: undefined,
      fecha: this.hoy(),
      estado: 'pendiente',
      total: 0,
      observaciones: ''
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: OrdenCompraBiblioteca) {
    this.orden = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.orden.proveedorId) {
      Swal.fire('Seleccione el proveedor');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateOrdenCompra(this.orden);
        Swal.fire('Orden actualizada');
      } else {
        await this.dataService.createOrdenCompra(this.orden);
        Swal.fire('Orden creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la orden');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: OrdenCompraBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar orden',
      text: 'Se eliminara la orden seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteOrdenCompra(item.id);
      await this.cargar();
      if (this.esEdicion && this.orden.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Orden eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la orden');
    }
  }

  private hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
