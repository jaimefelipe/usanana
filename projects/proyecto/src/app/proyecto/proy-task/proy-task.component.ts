import { Component, OnInit,EventEmitter   } from '@angular/core';

import { SplitterModule } from '@syncfusion/ej2-angular-layouts'

@Component({
  selector: 'app-proy-task',
  templateUrl: './proy-task.component.html',
  styleUrls: ['./proy-task.component.css']
})
export class ProyTaskComponent implements OnInit {
  ItemSelected = new EventEmitter<any>();
  NewItem = new EventEmitter<any>();
  UpdateItem = new EventEmitter<any>();
  CrearItem = new EventEmitter<any>();
  ItemSeleccionado:any;
  LastItemSelected:any;
  Proyecto:any;
  Empresa = localStorage.getItem("Nombre");
  nivelActual = '0';
  nivelSeleccionado = false;
  NivelText = ' Portafolio';
  Edit = false;
  constructor() { }

  ngOnInit() {
  }
  
  views = [
    { name: 'Lista', key: 'tareas' },
    { name: 'Kanban', key: 'kanban' },
    { name: 'Calendar', key: 'calendar' },
    { name: 'Gantt', key: 'gantt' }
  ];

  selectedView = 'kanban';
  filteredTasks: any[] = [];

  selectView(view: any) {
    this.selectedView = view.key;
  }

  onNodeSelected(node: any) {
    this.filteredTasks = node.subtasks || [];
  }
  newItem(Item){
    this.Proyecto = Item;
  }
  updateItem(Item){
    this.Proyecto = Item;
  }
  itemSeleccionadoEnTreeView(Id){
    this.ItemSeleccionado = Id;
  }
  tareaSeleccionadaEnList(Tarea){
    this.LastItemSelected = this.ItemSeleccionado;
    this.ItemSeleccionado = Tarea;
    this.Edit = true;
  }
  cerrarPanel(){
    this.ItemSeleccionado = this.LastItemSelected;
    this.nivelSeleccionado = false;
    this.Edit = false;
  }
  nuevaTarea(){
    this.nivelSeleccionado = true;
    this.Edit = true;
  }
  cambioNivel(Nivel){
    this.nivelActual = Nivel;
    if(this.nivelActual == '0'){
      this.NivelText = ' Portafolio';
    }
    if(this.nivelActual == '1'){
      this.NivelText = ' Programa';
    }
    if(this.nivelActual == '2'){
      this.NivelText = ' Proyecto';
    }
    if(this.nivelActual == '3'){
      this.NivelText = ' Fase';
    }
    if(this.nivelActual == '4'){
      this.NivelText = ' Entregable';
    }
    if(this.nivelActual == '5'){
      this.NivelText = ' Tarea';
    }
    if(this.nivelActual == '6'){
      this.NivelText = ' Actividad';
    }
   } 
}
