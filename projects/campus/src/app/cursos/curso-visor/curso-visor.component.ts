import { Component, OnInit } from '@angular/core';
import { CursoVisorService } from './curso-visor.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-curso-visor',
  templateUrl: './curso-visor.component.html',
  styleUrls: ['./curso-visor.component.css']
})
export class CursoVisorComponent implements OnInit {
  constructor(
    private cursoVisorService:CursoVisorService,
     private route:Router
  ) {}

  curso = this.crearCursoVacio();
  cursoDisponible = true;
  semanas: any[] = [];
  semanaSeleccionada: any = null;
  semanasCompletadas = new Set<number>();


  ngOnInit(): void {
    this.leerCurso();
    this.cargarSemanasYProgreso();
  }

  async cargarSemanasYProgreso() {
    await this.leerSemanas();
    await this.leerProgreso();
  }

  async leerProgreso() {
    const data = await this.cursoVisorService.leerProgreso();
    const filas = data?.['data'] || [];
    this.semanasCompletadas = new Set(filas.map((f: any) => Number(f.Id_Semana)));
  }

  estaCompletada(semana: any): boolean {
    return this.semanasCompletadas.has(Number(semana.Id_Semana));
  }

  esSemanaActual(semana: any): boolean {
    const actual = this.semanas.find(s => !this.estaCompletada(s));
    const idActual = actual ? actual.Id_Semana : this.semanas[this.semanas.length - 1]?.Id_Semana;
    return idActual === semana.Id_Semana;
  }

  avanceCurso(): number {
    if (!this.semanas.length) return 0;
    return Math.round((this.semanasCompletadas.size / this.semanas.length) * 100);
  }

  seleccionarSemana(semana: any) {
    this.semanaSeleccionada = semana;
  }
  async leerCurso(){
      let data = await this.cursoVisorService.leerCurso();
      const curso = data?.['data']?.[0];
      if(curso){
        this.curso = { ...this.crearCursoVacio(), ...curso };
        this.cursoDisponible = true;
      }else{
        this.curso = this.crearCursoVacio();
        this.cursoDisponible = false;
      }
  }
  async leerSemanas() {
    let data = await this.cursoVisorService.leerSemanas();
    this.semanas = data?.['data'] || [];

    // Seleccionar la primera semana automáticamente
    if (this.semanas && this.semanas.length > 0 && !this.semanaSeleccionada) {
      this.semanaSeleccionada = this.semanas[0];
    }
  }

  volverACursos() {
  // Redirige a la pantalla principal (ajusta según tu routing)
    this.route.navigate(['/']);
  }
  private crearCursoVacio(){
    return {
      Codigo:'',
      Creditos:'',
      Curso:'',
      Descripcion:'',
      Grupo:'',
      Horas:'',
      Modalidad:'',
      Nombre:'',
      Bienvenida:'',
      Imagen:''
    };
  }
}
