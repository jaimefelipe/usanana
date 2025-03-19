import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tareas-main',
  templateUrl: './tareas-main.component.html',
  styleUrls: ['./tareas-main.component.css']
})
export class TareasMainComponent implements OnInit {
  ItemSelected = new EventEmitter<any>();
  constructor() { }
  Edit = false;
  ItemSeleccionado = 0;
  Empresa = localStorage.getItem("Nombre");
  nombreUsuario = localStorage.getItem('Nombre_Usuario')
  selectedView = 'tareas';
  LastItemSelected:any;

  views = [
    { name: 'Lista', key: 'tareas' },
    { name: 'Kanban', key: 'kanban' },
    { name: 'Calendar', key: 'calendar' }
  ];
  ngOnInit() {
  }
  selectView(view){
    this.selectedView = view.key;
  }
  cerrarPanel(){
    this.Edit = false;
    this.ItemSeleccionado = -1;
  }
  tareaSeleccionadaEnList(Tarea){
    this.LastItemSelected = this.ItemSeleccionado;
    this.ItemSeleccionado = Tarea;
    this.Edit = true;
  }
  
}
