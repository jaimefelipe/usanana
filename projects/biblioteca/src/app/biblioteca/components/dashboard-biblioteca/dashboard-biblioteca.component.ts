import { Component, OnInit } from '@angular/core';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';

@Component({
  selector: 'app-dashboard-biblioteca',
  templateUrl: './dashboard-biblioteca.component.html',
  styleUrls: ['./dashboard-biblioteca.component.css']
})
export class DashboardBibliotecaComponent implements OnInit {
  librosRegistrados = 0;
  prestamosActivos = 0;
  prestamosVencidos = 0;
  reservasActivas = 0;
  loading = true;
  error = '';
  saludOperativa: 'normal' | 'atencion' | 'critica' = 'normal';
  resumenCirculacion: Array<{ etiqueta: string; valor: number; estado: 'normal' | 'atencion' | 'critica'; ruta: string }> = [];
  alertasCirculacion: string[] = [];

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargarResumen();
  }

  async cargarResumen() {
    this.loading = true;
    this.error = '';
    try {
      this.librosRegistrados = await this.dataService.countLibros();

      const prestamos = await this.dataService.getPrestamos();
      this.prestamosActivos = prestamos.filter(prestamo => this.estadoIgual(prestamo.estado, 'activo')).length;
      this.prestamosVencidos = prestamos.filter(prestamo => this.estadoIgual(prestamo.estado, 'vencido')).length;

      const reservas = await this.dataService.getReservas();
      this.reservasActivas = reservas.filter(reserva => this.estadoIgual(reserva.estado, 'activa')).length;
      this.actualizarMonitoreo();
    } catch (error) {
      console.error(error);
      this.error = 'No fue posible cargar el resumen operativo.';
    } finally {
      this.loading = false;
    }
  }

  private estadoIgual(estado: string, esperado: string): boolean {
    return String(estado || '').trim().toLowerCase() === esperado;
  }

  private actualizarMonitoreo() {
    this.saludOperativa = this.prestamosVencidos > 0 ? 'critica' : (this.reservasActivas > 0 ? 'atencion' : 'normal');
    this.resumenCirculacion = [
      { etiqueta: 'Prestamos activos', valor: this.prestamosActivos, estado: 'normal', ruta: '/prestamos' },
      { etiqueta: 'Prestamos vencidos', valor: this.prestamosVencidos, estado: this.prestamosVencidos > 0 ? 'critica' : 'normal', ruta: '/prestamos' },
      { etiqueta: 'Reservas activas', valor: this.reservasActivas, estado: this.reservasActivas > 0 ? 'atencion' : 'normal', ruta: '/reservas' }
    ];

    this.alertasCirculacion = [];
    if (this.prestamosVencidos > 0) {
      this.alertasCirculacion.push(`${this.prestamosVencidos} prestamo(s) vencido(s) requieren seguimiento.`);
    }
    if (this.reservasActivas > 0) {
      this.alertasCirculacion.push(`${this.reservasActivas} reserva(s) activa(s) deben revisarse antes de renovar prestamos.`);
    }
    if (this.alertasCirculacion.length === 0) {
      this.alertasCirculacion.push('Circulacion sin alertas operativas pendientes.');
    }
  }
}
