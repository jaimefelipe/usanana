import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Prestamo, Reserva } from '../../models/biblioteca.models';

@Component({
  selector: 'app-opac-cuenta',
  templateUrl: './opac-cuenta.component.html',
  styleUrls: ['./opac-cuenta.component.css']
})
export class OpacCuentaComponent implements OnInit {
  prestamos: Prestamo[] = [];
  reservas: Reserva[] = [];

  constructor(private dataService: BibliotecaDataService) {}

  async ngOnInit() {
    await this.cargar();
  }

  private calcularFechaVencimiento(dias = 7): string {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    return fecha.toISOString().slice(0, 10);
  }

  async cargar() {
    this.prestamos = await this.dataService.getPrestamosUsuario();
    this.reservas = await this.dataService.getReservasUsuario();
  }

  normalizarEstado(estado?: string): string {
    return (estado || '').trim().toLowerCase();
  }

  async renovar(prestamo: Prestamo) {
    if (this.normalizarEstado(prestamo.estado) !== 'activo') {
      Swal.fire('Acceso vencido', 'Este prestamo ya no puede renovarse porque el acceso esta vencido.', 'warning');
      return;
    }
    try {
      const nuevaFecha = this.calcularFechaVencimiento();
      const resultado = await this.dataService.renovarPrestamo(prestamo.id, nuevaFecha, prestamo.libroId);
      if (!resultado.renovado) {
        Swal.fire(
          'Renovacion bloqueada',
          `No se puede renovar este prestamo porque hay ${resultado.enEspera} usuario(s) esperando este titulo.`,
          'warning'
        );
        return;
      }
      await this.cargar();
      Swal.fire('Prestamo renovado', `Nueva fecha de vencimiento: ${nuevaFecha}.`, 'success');
    } catch (error) {
      console.error(error);
      Swal.fire('No se pudo renovar', 'Revise la conexion e intente nuevamente.', 'error');
    }
  }

  async cancelar(reserva: Reserva) {
    try {
      await this.dataService.cancelReserva(reserva.id);
      await this.cargar();
    } catch (error) {
      console.error(error);
    }
  }
}
