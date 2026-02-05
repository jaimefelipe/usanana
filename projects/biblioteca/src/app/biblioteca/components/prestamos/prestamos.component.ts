import { Component, OnInit } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Ejemplar, Prestamo, UsuarioBiblioteca } from '../../models/biblioteca.models';

interface PrestamoDetalle extends Prestamo {
  titulo: string;
  categoria: string;
  ejemplarId: number;
}

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {
  prestamos: PrestamoDetalle[] = [];
  ejemplares: Ejemplar[] = [];
  usuarios: UsuarioBiblioteca[] = [];
  edit = false;
  searchField = '';
  nuevoPrestamo = {
    ejemplarId: 0,
    usuarioId: 0,
    fechaVencimiento: ''
  };

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  keytab(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  search() {
    this.searchField = this.searchField.trim();
  }

  private calcularFechaVencimiento(dias = 7): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
  }

  async cargar() {
    const libros = await this.dataService.getLibros();
    const prestamos = await this.dataService.getPrestamos();
    this.ejemplares = await this.dataService.getEjemplares();
    this.usuarios = await this.dataService.getUsuarios();
    this.nuevoPrestamo.fechaVencimiento = this.calcularFechaVencimiento();

    this.prestamos = prestamos.map((prestamo: Prestamo) => {
      const libro = libros.find(l => l.id === prestamo.libroId);
      return {
        ...prestamo,
        ejemplarId: prestamo.ejemplarId || 0,
        titulo: libro ? libro.titulo : `Libro ${prestamo.libroId}`,
        categoria: libro ? libro.categoria : 'Sin categoria'
      };
    });
  }

  nuevo() {
    this.nuevoPrestamo = {
      ejemplarId: 0,
      usuarioId: 0,
      fechaVencimiento: this.calcularFechaVencimiento()
    };
    this.edit = true;
  }

  async crearPrestamo() {
    if (!this.nuevoPrestamo.ejemplarId || !this.nuevoPrestamo.usuarioId || !this.nuevoPrestamo.fechaVencimiento) {
      return;
    }
    try {
      await this.dataService.createPrestamo(
        this.nuevoPrestamo.ejemplarId,
        this.nuevoPrestamo.usuarioId,
        this.nuevoPrestamo.fechaVencimiento
      );
      this.nuevoPrestamo = {
        ejemplarId: 0,
        usuarioId: 0,
        fechaVencimiento: this.calcularFechaVencimiento()
      };
      this.edit = false;
      await this.cargar();
    } catch (error) {
      console.error(error);
    }
  }

  cancelar() {
    this.edit = false;
  }

  async devolver(prestamo: PrestamoDetalle) {
    if (!prestamo.ejemplarId) return;
    try {
      await this.dataService.devolverPrestamo(prestamo.id, prestamo.ejemplarId);
      await this.cargar();
    } catch (error) {
      console.error(error);
    }
  }

  async renovar(prestamo: PrestamoDetalle) {
    try {
      const nuevaFecha = this.calcularFechaVencimiento();
      await this.dataService.renovarPrestamo(prestamo.id, nuevaFecha);
      await this.cargar();
    } catch (error) {
      console.error(error);
    }
  }
}
