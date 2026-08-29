import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiBibliotecaService } from './mi-biblioteca.service';

@Component({
  selector: 'app-mi-biblioteca',
  templateUrl: './mi-biblioteca.component.html',
  styleUrls: ['./mi-biblioteca.component.css']
})
export class MiBibliotecaComponent implements OnInit {

  tabActivo = 'prestamos';
  idUsuario = 0;
  usuarioNombre = '';
  multaAcumulada = 0;
  prestamos = [];
  reservas = [];
  multas = [];
  cargando = true;

  constructor(private miBibService: MiBibliotecaService, private router: Router) {}

  ngOnInit() {
    if (!localStorage.getItem('Id_Empresa') || !localStorage.getItem('Id_Usuario')) {
      this.router.navigate(['/login']);
      return;
    }
    this.cargarDatos();
  }

  async cargarDatos() {
    this.cargando = true;
    const usuarioRes = await this.miBibService.obtenerUsuarioBiblioteca();
    const usuario = usuarioRes?.['data']?.[0];
    this.idUsuario = Number(usuario?.Id_Usuario || 0);
    this.usuarioNombre = usuario?.Nombre || '';
    this.multaAcumulada = Number(usuario?.Multa_Acumulada || 0);

    if (this.idUsuario) {
      const [prestamosRes, reservasRes, multasRes] = await Promise.all([
        this.miBibService.obtenerPrestamos(this.idUsuario),
        this.miBibService.obtenerReservas(this.idUsuario),
        this.miBibService.obtenerMultas(this.idUsuario)
      ]);
      this.prestamos = prestamosRes?.['data'] || [];
      this.reservas = reservasRes?.['data'] || [];
      this.multas = multasRes?.['data'] || [];
    }
    this.cargando = false;
  }

  irCatalogo() {
    this.router.navigate(['/biblioteca']);
  }

  estaVencido(prestamo: any): boolean {
    return Number(prestamo.Dias_Vencido) > 0 || String(prestamo.Estado || '').toLowerCase() === 'vencido';
  }

  estadoReserva(reserva: any): string {
    const estado = String(reserva?.Estado || '').toLowerCase();
    if (estado === 'disponible') return 'Disponible';
    if (estado === 'en espera') return 'En espera';
    return 'Activa';
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-CR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  }
}
