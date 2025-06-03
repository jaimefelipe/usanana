import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-actividad',
  templateUrl: './actividad.component.html',
  styleUrls: ['./actividad.component.css']
})
export class ActividadComponent implements OnInit {

  constructor() { }
  Semanas = []; // Se cargan desde Lms_SemanaCurso
  Actividades = []; // Se cargan desde Lms_Actividad

  Filtro = {
    Id_Semana: ''
  };

  Actividad = {
    Id_Actividad: '',
    Id_Empresa: 1,
    Id_Semana: '',
    Titulo: '',
    Tipo: 'Tarea', // o Foro, Sincrónica, Otro
    Descripcion: '',
    Fecha_Entrega: '',
    Requiere_Entrega: false,
    Rubrica_1: 0,
    Rubrica_2: 0,
    Rubrica_3: 0,
    Rubrica_4: 0,
    Rubrica_5: 0
  };
  ngOnInit() {
  }
  editar(a){

  }
  eliminar(e){

  }
  grabar(){

  }
  cancelar(){

  }
  cargarActividades(){}
}
