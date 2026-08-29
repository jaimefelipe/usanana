import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { BibliotecaDataService } from '../../services/biblioteca-data.service';
import { Ejemplar, Prestamo, Reserva, UsuarioBiblioteca } from '../../models/biblioteca.models';

interface PrestamoDetalle extends Prestamo {
  titulo: string;
  categoria: string;
  ejemplarId: number;
}

interface ReservaDetalle extends Reserva {
  titulo: string;
  categoria: string;
}

interface UsuarioActivoPorTipo {
  tipo: string;
  cantidad: number;
}

type TabCirculacion = 'activos' | 'pendientes' | 'reservados' | 'renovaciones' | 'vencidos' | 'historial';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.component.html',
  styleUrls: ['./prestamos.component.css']
})
export class PrestamosComponent implements OnInit {
  prestamos: PrestamoDetalle[] = [];
  reservas: ReservaDetalle[] = [];
  ejemplares: Ejemplar[] = [];
  usuarios: UsuarioBiblioteca[] = [];
  usuariosActivosPorTipo: UsuarioActivoPorTipo[] = [];
  tabActivo: TabCirculacion = 'activos';
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

  cambiarTab(tab: TabCirculacion) {
    this.tabActivo = tab;
    this.search();
  }

  normalizarEstado(estado?: string): string {
    return (estado || '').trim().toLowerCase();
  }

  private fechaPasada(fecha?: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const vencimiento = new Date(fecha);
    vencimiento.setHours(0, 0, 0, 0);
    return vencimiento.getTime() < hoy.getTime();
  }

  private estaDevuelto(prestamo: PrestamoDetalle): boolean {
    const estado = this.normalizarEstado(prestamo.estado);
    return estado === 'devuelto' || estado === 'cancelado' || estado === 'perdido' || !!prestamo.fechaDevolucion;
  }

  private esVencido(prestamo: PrestamoDetalle): boolean {
    const estado = this.normalizarEstado(prestamo.estado);
    return !this.estaDevuelto(prestamo) && (estado === 'vencido' || this.fechaPasada(prestamo.fechaVencimiento));
  }

  private esActivo(prestamo: PrestamoDetalle): boolean {
    return this.normalizarEstado(prestamo.estado) === 'activo' && !this.esVencido(prestamo);
  }

  get prestamosVisibles(): PrestamoDetalle[] {
    if (this.tabActivo === 'reservados') {
      return [];
    }
    if (this.tabActivo === 'pendientes') {
      return this.prestamos.filter(prestamo => this.normalizarEstado(prestamo.estado) === 'pendiente');
    }
    if (this.tabActivo === 'renovaciones') {
      return this.prestamos.filter(prestamo => Number(prestamo.renovaciones || 0) > 0);
    }
    if (this.tabActivo === 'vencidos') {
      return this.prestamos.filter(prestamo => this.esVencido(prestamo));
    }
    if (this.tabActivo === 'historial') {
      return this.prestamos.filter(prestamo => this.estaDevuelto(prestamo));
    }
    return this.prestamos.filter(prestamo => this.esActivo(prestamo));
  }

  get reservasVisibles(): ReservaDetalle[] {
    return this.reservas.filter(reserva => ['activa', 'en espera', 'disponible'].includes(this.normalizarEstado(reserva.estado)));
  }

  get cantidadActivos(): number {
    return this.prestamos.filter(prestamo => this.esActivo(prestamo)).length;
  }

  get cantidadPendientes(): number {
    return this.prestamos.filter(prestamo => this.normalizarEstado(prestamo.estado) === 'pendiente').length;
  }

  get cantidadReservados(): number {
    return this.reservasVisibles.length;
  }

  get cantidadRenovaciones(): number {
    return this.prestamos.filter(prestamo => Number(prestamo.renovaciones || 0) > 0).length;
  }

  get cantidadVencidos(): number {
    return this.prestamos.filter(prestamo => this.esVencido(prestamo)).length;
  }

  get cantidadHistorial(): number {
    return this.prestamos.filter(prestamo => this.estaDevuelto(prestamo)).length;
  }

  get tituloTabActivo(): string {
    const titulos: Record<TabCirculacion, string> = {
      activos: 'Prestamos activos',
      pendientes: 'Solicitudes pendientes',
      reservados: 'Recursos reservados',
      renovaciones: 'Renovaciones',
      vencidos: 'Prestamos vencidos',
      historial: 'Historial de prestamos'
    };
    return titulos[this.tabActivo];
  }

  async cargar() {
    const libros = await this.dataService.getLibros();
    const prestamos = await this.dataService.getPrestamos();
    const reservas = await this.dataService.getReservas();
    this.usuariosActivosPorTipo = await this.dataService.getUsuariosActivosPorTipo();
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

    this.reservas = reservas.map((reserva: Reserva) => {
      const libro = libros.find(l => l.id === reserva.libroId);
      return {
        ...reserva,
        titulo: libro ? libro.titulo : `Libro ${reserva.libroId}`,
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
      Swal.fire('Datos incompletos', 'Seleccione ejemplar, usuario y fecha de vencimiento.', 'warning');
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
      const mensaje = error instanceof Error ? error.message : 'No se pudo registrar el prestamo';
      Swal.fire('No se pudo registrar', mensaje, 'warning');
    }
  }

  cancelar() {
    this.edit = false;
  }

  async devolver(prestamo: PrestamoDetalle) {
    if (!prestamo.ejemplarId) return;
    try {
      const resultado = await this.dataService.devolverPrestamoConNotificacion(prestamo.id, prestamo.ejemplarId, prestamo.libroId);
      await this.cargar();
      if (resultado.notificado) {
        Swal.fire(
          'Prestamo devuelto',
          `Se marco la reserva como disponible para ${resultado.usuario || 'el siguiente usuario'} en la lista de espera.`,
          'success'
        );
      } else {
        Swal.fire('Prestamo devuelto', 'El ejemplar quedo disponible.', 'success');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('No se pudo devolver', 'Revise la conexion e intente nuevamente.', 'error');
    }
  }

  async renovar(prestamo: PrestamoDetalle) {
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
}
