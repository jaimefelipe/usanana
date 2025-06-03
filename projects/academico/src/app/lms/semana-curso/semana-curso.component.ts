import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-semana-curso',
  templateUrl: './semana-curso.component.html',
  styleUrls: ['./semana-curso.component.css']
})
export class SemanaCursoComponent implements OnInit {

  constructor() { }
  AulasVirtuales = []; // Se carga desde Lms_AulaVirtual JOIN Edu_Grupo JOIN Edu_Curso
  Semanas = [];        // Lista de semanas cargadas para el aula seleccionada

  Filtro = {
    Id_AulaVirtual: ''
  };

  Semana = {
    Id_Semana: '',
    Id_Empresa: 1,
    Id_AulaVirtual: '',
    Numero_Semana: '',
    Titulo: '',
    RutaAprendizaje: '',
    Fecha_Inicio: '',
    Fecha_Limite: ''
  };
  ngOnInit() {
  }
  cargarSemanas(){

  }
  grabar(){

  }
  cancelar(){

  }
  editar(s){

  }
  eliminar(s){

  }
}
