import { Component, OnInit } from '@angular/core';
import { ExpedienteAlumnoService } from './expediente-alumno.service';
@Component({
  selector: 'app-expediente-alumno',
  templateUrl: './expediente-alumno.component.html',
  styleUrls: ['./expediente-alumno.component.css']
})
export class ExpedienteAlumnoComponent implements OnInit {

  constructor(
    private expedienteAlumnoService:ExpedienteAlumnoService
  ) { }
  Carreras = [];
  Cursos = [];
  CursosCarrera = [];
  Id_Persona
  ngOnInit() {
    this.obtenerIdUsuario();
  }
  async obtenerIdUsuario(){
    this.Id_Persona= await this.expedienteAlumnoService.obtenerIdUsuario();
    this.leerCarreras();
  }
  async leerCarreras(){
    let data = await this.expedienteAlumnoService.cargarCarrerasAlumno(this.Id_Persona);
    if(data['total']>0){
      this.Carreras = data['data'];
      await this.leerCursosPorCarreras();
    }else{
      this.Carreras = [];
    }
  } 
  async leerCursosPorCarreras(){
    for (let i = 0; i < this.Carreras.length; i++) {
      await this.leerCursoCarrera( this.Carreras[i]['Id_Carrera'],i);
    }
    console.log(this.Carreras)
  }
  async leerCursoCarrera(Id_Carrera,i){
    let data =await  this.expedienteAlumnoService.cargarCursosAlumno(Id_Carrera,this.Id_Persona)
    if(data['total']>0){
      this.Carreras[i]['Cursos'] = data['data'];
    }
    else{
       this.Carreras[i]['Cursos'] = [];
    }
  }
}
