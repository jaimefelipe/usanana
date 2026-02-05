import { Component, OnInit } from '@angular/core';
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

  async renovar(prestamo: Prestamo) {
    try {
      const nuevaFecha = this.calcularFechaVencimiento();
      await this.dataService.renovarPrestamo(prestamo.id, nuevaFecha);
      await this.cargar();
    } catch (error) {
      console.error(error);
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
