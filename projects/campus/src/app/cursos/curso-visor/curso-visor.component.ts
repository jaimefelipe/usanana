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

  curso =  {
    Codigo:'',
    Creditos:'',
    Curso:'',
    Descripcion:'',
    Horas:'',
    Nombre:'',
    Bienvenida:''
  };
  semanas: any[] = [];
  semanaSeleccionada: any = null;


  ngOnInit(): void {
    this.leerCurso();
    this.leerSemanas();
  }

  seleccionarSemana(semana: any) {
    this.semanaSeleccionada = semana;
  }
  async leerCurso(){
      let data = await this.cursoVisorService.leerCurso();
      this.curso = data['data'][0];
  }
  async leerSemanas() {
    let data = await this.cursoVisorService.leerSemanas();
    this.semanas = data['data'];

    // Seleccionar la primera semana automáticamente
    if (this.semanas && this.semanas.length > 0 && !this.semanaSeleccionada) {
      this.semanaSeleccionada = this.semanas[0];
    }
  }

  volverACursos() {
  // Redirige a la pantalla principal (ajusta según tu routing)
    this.route.navigate(['/']);
  }
}
