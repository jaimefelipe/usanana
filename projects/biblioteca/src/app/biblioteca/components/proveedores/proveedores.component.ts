import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { ProveedorBiblioteca } from '../../models/biblioteca.models';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: ProveedorBiblioteca[] = [];
  proveedor: ProveedorBiblioteca = {
    id: 0,
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: '',
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
    this.proveedores = await this.dataService.getProveedores();
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
    this.proveedor = {
      id: 0,
      nombre: '',
      contacto: '',
      telefono: '',
      email: '',
      direccion: '',
      estado: 'activo'
    };
    this.esEdicion = false;
  }

  nuevo() {
    this.resetForm();
    this.edit = true;
  }

  editar(item: ProveedorBiblioteca) {
    this.proveedor = { ...item };
    this.esEdicion = true;
    this.edit = true;
  }

  async guardar() {
    if (!this.proveedor.nombre) {
      Swal.fire('Complete el nombre');
      return;
    }

    try {
      if (this.esEdicion) {
        await this.dataService.updateProveedor(this.proveedor);
        Swal.fire('Proveedor actualizado');
      } else {
        await this.dataService.createProveedor(this.proveedor);
        Swal.fire('Proveedor creado');
      }
      this.resetForm();
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
      Swal.fire('Error al guardar el proveedor');
    }
  }

  cancelar() {
    this.resetForm();
    this.edit = false;
  }

  async eliminar(item: ProveedorBiblioteca) {
    const result = await Swal.fire({
      title: 'Eliminar proveedor',
      text: 'Se eliminara el proveedor seleccionado',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!result.isConfirmed) return;

    try {
      await this.dataService.deleteProveedor(item.id);
      await this.cargar();
      if (this.esEdicion && this.proveedor.id === item.id) {
        this.cancelar();
      }
      Swal.fire('Proveedor eliminado');
    } catch (error) {
      console.error(error);
      Swal.fire('Error al eliminar el proveedor');
    }
  }
}
