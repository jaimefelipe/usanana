import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.css']
})
export class RecursoComponent implements OnInit {

  constructor() { }
  Semanas = []; // Se carga desde Lms_SemanaCurso
  Recursos = []; // Recursos cargados por semana

  Filtro = {
    Id_Semana: ''
  };

  Recurso = {
    Id_Recurso: '',
    Id_Empresa: 1,
    Id_Semana: '',
    Titulo: '',
    Tipo: 'PDF', // 'Video', 'Link', 'Presentación'
    URL: ''
  };
  ngOnInit() {
  }
  grabar(){};
  cancelar(){};
  editar(r){};
  eliminar(r){};
  cargarRecursos(){};
}
