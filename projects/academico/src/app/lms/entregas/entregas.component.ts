import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entregas',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.css']
})
export class EntregasComponent implements OnInit {

  constructor() { }
  Actividades = []; // Se cargan desde Lms_Actividad
  Entregas = []; // Se cargan desde Lms_EntregaActividad

  Filtro = {
    Id_Actividad: ''
  };

  Entrega = {
    Id_Entrega: '',
    Id_Empresa: 1,
    Id_Actividad: '',
    Id_Persona: '',
    Fecha_Entrega: '',
    Archivo: '',
    Nota: null,
    Comentario_Docente: ''
  };
  ngOnInit() {
  }
  cargarEntregas(){

  }
  guardar(e){}
}
