import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LibroDetalleService } from './libro-detalle.service';
import { MiBibliotecaService } from '../mi-biblioteca/mi-biblioteca.service';

@Component({
  selector: 'app-libro-detalle',
  templateUrl: './libro-detalle.component.html',
  styleUrls: ['./libro-detalle.component.css']
})
export class LibroDetalleComponent implements OnInit {

  libro: any = null;
  autores = [];
  ejemplares = [];
  idUsuario = 0;
  usuarioBloqueado = false;
  cargando = true;
  reservando = false;
  mensajeReserva = '';
  tipoMensaje = '';

  get disponibles(): number {
    return this.ejemplares.filter((e: any) => e.Estado === 'disponible').length;
  }

  /** v2.1: licencia del libro derivada del MARC 533 en Biblioteca. */
  get esAccesoAbierto(): boolean {
    const licencia = this.libro?.Licencia;
    return licencia === 'CC-BY' || licencia === 'CC-BY-SA';
  }

  get digitales(): any[] {
    return this.ejemplares.filter((e: any) => e.Tipo_Soporte === 'digital' && e.URL_Archivo);
  }

  constructor(
    private detalleService: LibroDetalleService,
    private miBibService: MiBibliotecaService,
    private router: Router
  ) {}

  ngOnInit() {
    const idLibro = Number(localStorage.getItem('Id_Libro'));
    if (!idLibro) {
      this.router.navigate(['/biblioteca']);
      return;
    }
    this.cargarDatos(idLibro);
  }

  async cargarDatos(idLibro: number) {
    this.cargando = true;
    const [libroRes, autoresRes, ejemplaresRes, usuarioRes] = await Promise.all([
      this.detalleService.obtenerLibro(idLibro),
      this.detalleService.obtenerAutores(idLibro),
      this.detalleService.obtenerEjemplares(idLibro),
      this.miBibService.obtenerUsuarioBiblioteca()
    ]);

    this.libro = libroRes?.['data']?.[0] || null;
    this.autores = autoresRes?.['data'] || [];
    this.ejemplares = ejemplaresRes?.['data'] || [];

    const usuario = usuarioRes?.['data']?.[0];
    this.idUsuario = Number(usuario?.Id_Usuario || 0);
    this.usuarioBloqueado = Number(usuario?.Bloqueado) === 1 || Number(usuario?.Multa_Acumulada || 0) > 0;
    this.cargando = false;
  }

  /** Solicita prestamo si hay ejemplares disponibles; si no, deja la reserva en lista de espera. */
  async solicitar() {
    if (this.disponibles > 0) {
      await this.solicitarPrestamo();
    } else {
      await this.reservar();
    }
  }

  private async validarLimite(): Promise<boolean> {
    const validacion = await this.detalleService.validarLimiteCirculacion(this.idUsuario);
    if (!validacion.ok) {
      this.tipoMensaje = 'warn';
      this.mensajeReserva = validacion.motivo || 'No cumples con las politicas de circulacion.';
      return false;
    }
    return true;
  }

  async solicitarPrestamo() {
    const idLibro = Number(localStorage.getItem('Id_Libro'));
    if (!idLibro || !this.idUsuario) return;
    if (!(await this.validarLimite())) return;

    this.reservando = true;
    const res = await this.detalleService.crearPrestamo(idLibro, this.idUsuario);
    this.reservando = false;

    if (res?.['success'] === 'true') {
      this.tipoMensaje = 'ok';
      this.mensajeReserva = 'Prestamo registrado. Ya puedes ver el ejemplar en Mi Biblioteca.';
      await this.cargarDatos(idLibro);
    } else {
      this.tipoMensaje = 'err';
      this.mensajeReserva = res?.['Error'] || res?.['error'] || 'No se pudo registrar el prestamo.';
    }
  }

  async reservar() {
    const idLibro = Number(localStorage.getItem('Id_Libro'));
    if (!idLibro || !this.idUsuario) return;

    const existente = await this.detalleService.verificarReservaExistente(idLibro, this.idUsuario);
    if (Number(existente?.['total'] || 0) > 0) {
      this.tipoMensaje = 'warn';
      this.mensajeReserva = 'Ya tienes una reserva activa o disponible para este libro.';
      return;
    }
    if (!(await this.validarLimite())) return;

    this.reservando = true;
    const res = await this.detalleService.crearReserva(idLibro, this.idUsuario);
    this.reservando = false;

    if (res?.['success'] === 'true') {
      this.tipoMensaje = 'ok';
      this.mensajeReserva = 'Reserva registrada. La biblioteca te notificara cuando el libro este disponible.';
    } else {
      this.tipoMensaje = 'err';
      this.mensajeReserva = res?.['Error'] || res?.['error'] || 'No se pudo registrar la reserva.';
    }
  }

  volver() {
    this.router.navigate(['/biblioteca']);
  }
}
