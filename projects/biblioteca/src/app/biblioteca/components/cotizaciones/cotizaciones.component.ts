import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { CotizacionBiblioteca, ProveedorBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.component.html',
  styleUrls: ['./cotizaciones.component.css']
})
export class CotizacionesComponent implements OnInit {
  cotizaciones: CotizacionBiblioteca[] = [];
  cotizacion: CotizacionBiblioteca = {
    id: 0,
    proveedorId: 0,
    descripcion: '',
    fecha: this.hoy(),
    total: 0,
    estado: 'pendiente'
  };
  proveedores: ProveedorBiblioteca[] = [];
  esEdicion = false;
  edit = false;
  searchField = '';

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  async cargar() {
    const [cotizaciones, proveedores] = await Promise.all([
      this.dataService.getCotizaciones(),
      this.dataService.getProveedores()
    ]);
    this.cotizaciones = cotizaciones;
    this.proveedores = proveedores;
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
    this.cotizacion = {
      id: 0,
      proveedorId: 0,
      descripcion: '',
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

  editar(item: CotizacionBiblioteca) {
    this.cotizacion = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.cotizacion.proveedorId) {
      Swal.fire('Seleccione el proveedor');
      return;
    }
    if (!this.cotizacion.descripcion) {
      Swal.fire('Complete la descripcion');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateCotizacion(this.cotizacion);
        Swal.fire('Cotizacion actualizada');
      } else {
        await this.dataService.createCotizacion(this.cotizacion);
        Swal.fire('Cotizacion creada');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar la cotizacion');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: CotizacionBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar cotizacion',
      text: 'Se eliminara la cotizacion seleccionada',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteCotizacion(item.id);
      await this.cargar();
      if (this.esEdicion && this.cotizacion.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Cotizacion eliminada');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar la cotizacion');
    }
  }

  private hoy(): string {
    return new Date().toISOString().slice(0, 10);
  }
}
