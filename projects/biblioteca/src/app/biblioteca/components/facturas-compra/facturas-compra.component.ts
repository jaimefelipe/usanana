import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { FacturaCompraBiblioteca, OrdenCompraBiblioteca, ProveedorBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-facturas-compra',
  templateUrl: './facturas-compra.component.html',
  styleUrls: ['./facturas-compra.component.css']
})
export class FacturasCompraComponent implements OnInit {
  facturas: FacturaCompraBiblioteca[] = [];
  factura: FacturaCompraBiblioteca = {
    id: 0,
    ordenCompraId: undefined,
    proveedorId: 0,
    numero: '',
    fecha: this.hoy(),
    total: 0,
    estado: 'pendiente'
  };
  proveedores: ProveedorBiblioteca[] = [];
  ordenes: OrdenCompraBiblioteca[] = [];
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    const [facturas, proveedores, ordenes] = await Promise.all([
      this.dataService.getFacturasCompra(),
      this.dataService.getProveedores(),
      this.dataService.getOrdenesCompra()
    ]);
    this.facturas = facturas;
    this.proveedores = proveedores;
    this.ordenes = ordenes;
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
    this.factura = {
      id: 0,
      ordenCompraId: undefined,
      proveedorId: 0,
      numero: '',
      fecha: this.hoy(),
      total: 0,
      estado: 'pendiente'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: FacturaCompraBiblioteca) {
    this.factura = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.factura.proveedorId) {
      Swal.fire('Seleccione el proveedor');
      return;
    }
    if (!this.factura.numero) {
      Swal.fire('Complete el numero de factura');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateFacturaCompra(this.factura);
        Swal.fire('Factura actualizada');
      } else {
        await this.dataService.createFacturaCompra(this.factura);
        Swal.fire('Factura creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la factura');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: FacturaCompraBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar factura',
      text: 'Se eliminara la factura seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteFacturaCompra(item.id);
      await this.cargar();
      if (this.esEdicion && this.factura.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Factura eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la factura');
    }
  }

  private hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
