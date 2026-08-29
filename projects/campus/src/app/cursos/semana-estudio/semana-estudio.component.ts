import { Component, OnInit, Input,SimpleChanges } from '@angular/core';
import { Semana, ItemSemana } from './semana.model';
import { SemanaEstudioService } from './semana-estudio.service';
import { CursoVisorService } from '../curso-visor/curso-visor.service';

@Component({
  selector: 'app-semana-estudio',
  templateUrl: './semana-estudio.component.html',
  styleUrls: ['./semana-estudio.component.css']
})
export class SemanaEstudioComponent implements OnInit {
  @Input() semana!: Semana;
  constructor(
    private semanaEstudioService:SemanaEstudioService,
    private cursoVisorService:CursoVisorService
  ) { }
  Descripcion = 'Descripcion';
  Titulo = 'Titulo';
  Recursos = [];
  Actividades = [];
  Semana = {
    Titulo:'',
    RutaAprendizaje:'',
    Fecha_Inicio:'',
    Fecha_Limite:''
  }

  // ── Navegacion entre semanas + avance del curso ────────────
  semanas: any[] = [];
  semanasCompletadas = new Set<number>();
  avanzandoSemana = false;

  async ngOnInit() {
    await this.cargarSemanasYProgreso();
    await this.leerSemana();
    await this.LeerRecursos();
    await this.leerActividades();
    this.seleccionarPrimerContenido();
  }

  get Id_Semana(): string {
    return localStorage.getItem('Id_Semana') || '';
  }

  itemSeleccionado: ItemSemana | null = null;
  actividadSeleccionada: any = null;

  seleccionarItem(item: ItemSemana) {
    this.itemSeleccionado = item;
    this.actividadSeleccionada = null;
  }

  async LeerRecursos(){
    let data = await this.semanaEstudioService.leerRecursosSemana(this.Id_Semana);
    this.Recursos = data?.['data'] || [];
  }
  async leerActividades(){
    let data = await this.semanaEstudioService.leerActividadesSemana(this.Id_Semana)
    this.Actividades = data?.['data'] || [];
  }
  async leerSemana(){
    let data = await this.semanaEstudioService.leerInfoSemana(this.Id_Semana);
    this.Semana = data?.['data']?.[0] || this.Semana;

  }
  volverAlCurso(){
     history.back();
  }
  seleccionarActividad(actividad: any) {
    this.itemSeleccionado = null;
    this.actividadSeleccionada = actividad;
  }
  private seleccionarPrimerContenido() {
    if (this.Recursos.length > 0) {
      this.itemSeleccionado = this.Recursos[0];
      this.actividadSeleccionada = null;
      return;
    }

    if (this.Actividades.length > 0) {
      this.seleccionarActividad(this.Actividades[0]);
    }
  }

  // ── Navegacion entre semanas + avance del curso ────────────
  async cargarSemanasYProgreso() {
    const data = await this.cursoVisorService.leerSemanas();
    this.semanas = data?.['data'] || [];
    await this.actualizarProgreso();
  }

  async actualizarProgreso() {
    const data = await this.cursoVisorService.leerProgreso();
    const filas = data?.['data'] || [];
    this.semanasCompletadas = new Set(filas.map((f: any) => Number(f.Id_Semana)));
  }

  get Avance(): number {
    if (!this.semanas.length) return 0;
    return Math.round((this.semanasCompletadas.size / this.semanas.length) * 100);
  }

  private indiceSemanaActual(): number {
    return this.semanas.findIndex(s => Number(s.Id_Semana) === Number(this.Id_Semana));
  }

  haySiguienteSemana(): boolean {
    const idx = this.indiceSemanaActual();
    return idx >= 0 && idx < this.semanas.length - 1;
  }

  async siguienteSemana() {
    if (this.avanzandoSemana) return;
    this.avanzandoSemana = true;
    try {
      await this.cursoVisorService.marcarSemanaCompletada(this.Id_Semana);
      await this.actualizarProgreso();

      const idx = this.indiceSemanaActual();
      const siguiente = this.semanas[idx + 1];
      if (!siguiente) return;

      localStorage.setItem('Id_Semana', siguiente.Id_Semana);
      this.itemSeleccionado = null;
      this.actividadSeleccionada = null;
      await this.leerSemana();
      await this.LeerRecursos();
      await this.leerActividades();
      this.seleccionarPrimerContenido();
    } finally {
      this.avanzandoSemana = false;
    }
  }
}
