import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aula-virtual',
  templateUrl: './aula-virtual.component.html',
  styleUrls: ['./aula-virtual.component.css']
})
export class AulaVirtualComponent implements OnInit {

  constructor() { }
  Aula = {
    Id_AulaVirtual: '',
    Id_Empresa: 1,
    Id_Grupo: '',
    Bienvenida: '',
    Link_Reglamento: '',
    Link_Etiqueta: '',
    Activo: true
  };

  Grupos = []; // Cargados desde Edu_Grupo
  
  ngOnInit() {
  }
  grabar(){}
  cancelar(){}
}
