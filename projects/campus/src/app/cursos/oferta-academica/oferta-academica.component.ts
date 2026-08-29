import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OfertaAcademicaService } from './oferta-academica.service';

@Component({
  selector: 'app-oferta-academica',
  templateUrl: './oferta-academica.component.html',
  styleUrls: ['./oferta-academica.component.css']
})
export class OfertaAcademicaComponent implements OnInit {

  @ViewChild('detallePanel') detallePanel?: ElementRef<HTMLElement>;

  carreras: any[] = [];
  cursos: any[] = [];
  carreraSeleccionada: any = null;
  cargando = false;
  cargandoPlan = false;
  solicitando = false;
  filtro = '';

  constructor(
    private ofertaService: OfertaAcademicaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCarreras();
  }

  async cargarCarreras() {
    this.cargando = true;
    const data = await this.ofertaService.cargarCarreras();
    this.carreras = data?.data || [];
    this.cargando = false;

    if (this.carreras.length > 0) {
      const carreraPreseleccionada = Number(localStorage.getItem('Carrera_Interes') || '0');
      const seleccion = this.carreras.find(c => Number(c.Id_Carrera) === carreraPreseleccionada) || this.carreras[0];
      this.seleccionarCarrera(seleccion, false);
    }
  }

  carrerasFiltradas(): any[] {
    const term = this.filtro.trim().toLowerCase();
    if (!term) {
      return this.carreras;
    }

    return this.carreras.filter(c => [
      c.Codigo,
      c.Carrera,
      c.Descripcion,
      c.Facultad,
      this.getNivel(c.Nivel)
    ].some(v => String(v || '').toLowerCase().includes(term)));
  }

  carrerasAgrupadasPorFacultad(): any[] {
    const grupos = new Map<string, any[]>();
    for (const carrera of this.carrerasFiltradas()) {
      const facultad = String(carrera.Facultad || 'Programas sin facultad');
      if (!grupos.has(facultad)) {
        grupos.set(facultad, []);
      }
      grupos.get(facultad)?.push(carrera);
    }

    return Array.from(grupos, ([facultad, carreras]) => ({ facultad, carreras }))
      .sort((a, b) => a.facultad.localeCompare(b.facultad, 'es'));
  }

  async seleccionarCarrera(carrera: any, desplazar = true) {
    this.carreraSeleccionada = carrera;
    this.cursos = [];
    this.cargandoPlan = true;
    const data = await this.ofertaService.cargarPlanEstudios(carrera.Id_Carrera);
    this.cursos = data?.data || [];
    this.cargandoPlan = false;

    if (desplazar && this.esPantallaMovil()) {
      setTimeout(() => this.scrollDetalle(), 80);
    }
  }

  scrollDetalle() {
    this.detallePanel?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  cursosPorBloque(): any[] {
    const grupos = new Map<string, any[]>();
    for (const curso of this.cursos) {
      const bloque = String(curso.Bloque || 'General');
      if (!grupos.has(bloque)) {
        grupos.set(bloque, []);
      }
      grupos.get(bloque)?.push(curso);
    }
    return Array.from(grupos, ([bloque, cursos]) => ({ bloque, cursos }));
  }

  getNivel(nivel: any): string {
    const niveles = {
      '1': 'Curso libre',
      '2': 'Técnico',
      '3': 'Diploma',
      '4': 'Certificación',
      '5': 'Especialización',
      '6': 'Bachillerato',
      '7': 'Licenciatura',
      '8': 'Maestría',
      '9': 'Doctorado',
      'T': 'Técnico'
    };
    return niveles[String(nivel)] || 'Programa académico';
  }

  resumen(texto: any, maximo = 160): string {
    const limpio = String(texto || '').replace(/\s+/g, ' ').trim();
    if (limpio.length <= maximo) {
      return limpio;
    }

    const recorte = limpio.slice(0, maximo);
    const ultimoEspacio = recorte.lastIndexOf(' ');
    return `${recorte.slice(0, ultimoEspacio > 80 ? ultimoEspacio : maximo).trim()}...`;
  }

  tieneSesion(): boolean {
    return !!localStorage.getItem('Id_Empresa') && !!localStorage.getItem('Id_Usuario');
  }

  private esPantallaMovil(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(max-width: 960px)').matches;
  }

  async solicitarMatricula() {
    if (!this.carreraSeleccionada) {
      return;
    }

    localStorage.setItem('Carrera_Interes', String(this.carreraSeleccionada.Id_Carrera));

    if (!this.tieneSesion()) {
      await Swal.fire({
        title: 'Solicitud de matrícula',
        text: 'Primero completa el registro de primer ingreso para asociar esta carrera a tu expediente.',
        icon: 'info',
        confirmButtonText: 'Continuar'
      });
      this.router.navigate(['/primeringreso'], { queryParams: { carrera: this.carreraSeleccionada.Id_Carrera } });
      return;
    }

    this.solicitando = true;
    const persona = await this.ofertaService.obtenerPersonaSesion();
    const idPersona = Number(persona?.data?.[0]?.Id_Persona || 0);

    if (!idPersona) {
      this.solicitando = false;
      await Swal.fire({
        title: 'Completar expediente',
        text: 'Para solicitar matrícula primero completa tus datos de admisión.',
        icon: 'info',
        confirmButtonText: 'Continuar'
      });
      this.router.navigate(['/primeringreso'], { queryParams: { carrera: this.carreraSeleccionada.Id_Carrera } });
      return;
    }

    const asignada = await this.ofertaService.asignarCarrera(this.carreraSeleccionada.Id_Carrera, idPersona);
    this.solicitando = false;

    if (asignada?.success === 'true' || asignada?.success === true || asignada?.total !== undefined) {
      await Swal.fire('Carrera agregada', 'Ahora puedes solicitar los cursos disponibles para matrícula.', 'success');
      this.router.navigate(['/matricula']);
      return;
    }

    Swal.fire('No se pudo solicitar', asignada?.message || asignada?.Error || 'Inténtalo nuevamente.', 'warning');
  }
}
