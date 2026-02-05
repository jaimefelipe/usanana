import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { OrdenCompraBiblioteca, OrdenCompraDetalleBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-ordenes-compra-detalle',
  templateUrl: './ordenes-compra-detalle.component.html',
  styleUrls: ['./ordenes-compra-detalle.component.css']
})
export class OrdenesCompraDetalleComponent implements OnInit {
  detalles: OrdenCompraDetalleBiblioteca[] = [];
  detalle: OrdenCompraDetalleBiblioteca = {
    id: 0,
    ordenCompraId: 0,
    descripcion: '',
    cantidad: 1,
    costoUnitario: 0,
    subtotal: 0
  };
  ordenes: OrdenCompraBiblioteca[] = [];
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    const [detalles, ordenes] = await Promise.all([
      this.dataService.getOrdenesCompraDetalle(),
      this.dataService.getOrdenesCompra()
    ]);
    this.detalles = detalles;
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
    this.detalle = {
      id: 0,
      ordenCompraId: 0,
      descripcion: '',
      cantidad: 1,
      costoUnitario: 0,
      subtotal: 0
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: OrdenCompraDetalleBiblioteca) {
    this.detalle = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.detalle.ordenCompraId) {
      Swal.fire('Seleccione la orden');
      return;
    }
    if (!this.detalle.descripcion) {
      Swal.fire('Complete la descripcion');
      return;
    }
    this.detalle.subtotal = (this.detalle.cantidad || 0) * (this.detalle.costoUnitario || 0);

    try {
      if (this.esEdicion) {
        await this.dataService.updateOrdenCompraDetalle(this.detalle);
        Swal.fire('Detalle actualizado');
      } else {
        await this.dataService.createOrdenCompraDetalle(this.detalle);
        Swal.fire('Detalle creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el detalle');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: OrdenCompraDetalleBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar detalle',
      text: 'Se eliminara el detalle seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteOrdenCompraDetalle(item.id);
      await this.cargar();
      if (this.esEdicion && this.detalle.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Detalle eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el detalle');
    }
  }
}
