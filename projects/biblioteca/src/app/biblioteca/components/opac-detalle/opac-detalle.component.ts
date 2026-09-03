import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Libro, Ejemplar, esAccesoAbierto } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-detalle',
  templateUrl: './opac-detalle.component.html',
  styleUrls: ['./opac-detalle.component.css']
})
export class OpacDetalleComponent implements OnInit {
  esAccesoAbierto = esAccesoAbierto;
  libro?: Libro;
  ejemplares: Ejemplar[] = [];
  cargando = true;
  procesando = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: BibliotecaDataService
  ) {}

  async ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      await this.cargar(id);
    } else {
      this.cargando = false;
    }
  }

  private async cargar(id: number) {
    this.cargando = true;
    const [libro, ejemplares] = await Promise.all([
      this.dataService.getLibroById(id),
      this.dataService.getEjemplaresPorLibro(id)
    ]);
    this.libro = libro;
    this.ejemplares = ejemplares;
    this.cargando = false;
  }

  get disponibles(): number {
    return this.ejemplares.filter(e => e.estado === 'disponible').length;
  }

  get digitales(): Ejemplar[] {
    return this.ejemplares.filter(e => e.tipoSoporte === 'digital' && e.urlArchivo);
  }

  async solicitarPrestamo() {
    if (!this.libro) return;
    this.procesando = true;
    try {
      await this.dataService.solicitarPrestamoLibro(this.libro.id);
      Swal.fire('Prestamo registrado', 'Ya puedes ver el ejemplar en Mi cuenta.', 'success');
      await this.cargar(this.libro.id);
    } catch (error) {
      console.error(error);
      const mensaje = error instanceof Error ? error.message : 'No se pudo registrar el prestamo';
      Swal.fire('No se pudo registrar', mensaje, 'warning');
    } finally {
      this.procesando = false;
    }
  }

  async reservar() {
    if (!this.libro) return;
    this.procesando = true;
    try {
      await this.dataService.createReserva(this.libro.id);
      Swal.fire('Reserva creada', 'La biblioteca te notificara cuando el libro este disponible.', 'success');
    } catch (error) {
      console.error(error);
      const mensaje = error instanceof Error ? error.message : 'No se pudo crear la reserva';
      Swal.fire('No se pudo crear la reserva', mensaje, 'warning');
    } finally {
      this.procesando = false;
    }
  }
}
