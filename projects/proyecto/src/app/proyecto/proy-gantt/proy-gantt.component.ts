import { Component, OnInit,Input } from '@angular/core';
import { ProyGanttService } from './proy-gantt.service';
import { Output, EventEmitter } from '@angular/core';
/*
import * as GanttModule from 'frappe-gantt';
const Gantt = GanttModule.default; 
*/
//import Gantt from "frappe-gantt";



@Component({
  selector: 'app-proy-gantt',
  templateUrl: './proy-gantt.component.html',
  styleUrls: ['./proy-gantt.component.css']
})
export class ProyGanttComponent implements OnInit {
  @Input() ItemSelected: EventEmitter<string>; 
  @Input() TabSelected: EventEmitter<string>; 

  constructor(
    private proyGanttService:ProyGanttService
  ) { }

  Task_Id = '';
  Tab_Id = '';
  Tareas = [];
  tasks = [
    {
    id: 'Task 1',
    name: 'Tarea de Prueba',
    start: '2024-03-10',
    end: '2024-03-12',
    progress: 20
    //dependencies: 'Task 2, Task 3'
    }
  ]
  gantt: any;

 
  ngOnInit() {
    this.subscribeToParentEmitter(); 
     
  }

  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      this.Task_Id = data;
      this.leerTareas();
    }); 
    this.TabSelected.subscribe((data: any) => { 
        this.Tab_Id = data;
        this.leerTareas();
    });
  } 

  cambiarDia(){
    this.gantt.change_view_mode('Day')
  }
  cambiarSemana(){
    this.gantt.change_view_mode('Week')
  }
  cambiarMes(){
    this.gantt.change_view_mode('Month')
  }
  async leerTareas(){
    if(this.Tab_Id == '4'){
      let data = await this.proyGanttService.leerItems(this.Task_Id);
      this.Tareas = data['data'];
      // @ts-ignore-start
    this.gantt = new Gantt("#gantt", this.Tareas, {
      header_height: 50,
      column_width: 30,
      step: 24,
      view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
      bar_height: 20,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 18,
      view_mode: 'Week',
      date_format: 'YYYY-MM-DD',
      language: 'es', // or 'es', 'it', 'ru', 'ptBr', 'fr', 'tr', 'zh', 'de', 'hu'
      on_click: function (task) {
        console.log(task);
      },
      on_date_change: function(task, start, end) {
        console.log(task, start, end);
      },
      on_progress_change: function(task, progress) {
        console.log(task, progress);
      },
      on_view_change: function(mode) {
        console.log(mode);
      },
      /*custom_popup_html: function(task) {
        // the task object will contain the updated
        // dates and progress value
        const end_date = task._end;
        return `
        <div class="details-container">
          <h5>${task.name}</h5>
          <p>Expected to finish by ${end_date}</p>
          <p>${task.progress}% completed!</p>
        </div>
        `;
      }*/
    });

    // @ts-ignore-end
    }
  }
}
