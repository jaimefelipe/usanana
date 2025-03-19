import { Component, OnInit,Input,SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TaskListService } from './task-list.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  @Input() ItemSelected: number;
  @Output() TareaSeleccionadaEnList = new EventEmitter<any>();
  constructor(
    private taskListService:TaskListService
  ) { }

  searchField = '';
  Tareas = [];

  ngOnInit() {
    this.leerProyectos();
  }
  ngOnChanges(changes: SimpleChanges) {
      let Id_Proyecto = changes['ItemSelected']['currentValue'];
      this.leerProyectos(Id_Proyecto);
  }
  search(){

  }
  keytab(e){

  }
  ChangePage(a){

  }

  editRecord(Record){
    this.TareaSeleccionadaEnList.emit(Record.Id_Proyecto);
  }
  async leerProyectos(Id?){
    let data = await this.taskListService.leerProyectosHijos(Id);
    if(data['success'] == 'true'){
     this.Tareas = data['data'];
    }else{
      this.Tareas = [];
    }
  }

}
