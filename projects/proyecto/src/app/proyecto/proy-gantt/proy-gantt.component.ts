import { Component, OnInit,Input,ViewChild,ElementRef  } from '@angular/core';
import { ProyGanttService } from './proy-gantt.service';
import { Output, EventEmitter } from '@angular/core';
import { GanttItem,GanttToolbarOptions,GanttViewType,GanttBarClickEvent,GanttDragEvent } from '@worktile/gantt';
//import {DayPilot, DayPilotGanttComponent} from "daypilot-pro-angular";
import { DayPilot } from '../../../assets/daypilot/daypilot-all.min';


@Component({
  selector: 'app-proy-gantt',
  templateUrl: './proy-gantt.component.html',
  styleUrls: ['./proy-gantt.component.css']
})
export class ProyGanttComponent implements OnInit {
  @Input() ItemSelected: EventEmitter<string>; 
  @Input() TabSelected: EventEmitter<string>; 
  @Output() SeleccionarItem = new EventEmitter<any>();
  
  //@ViewChild("gantt")
  //gantt: DayPilotGanttComponent;

  constructor(
    private proyGanttService:ProyGanttService
  ) { }
 
  loading = false;
  Task_Id = '';
  Tab_Id = '';
  Tareas = [];
  Miembros = [];
  
  dp = new DayPilot.Gantt("dp", {
    cellWidthSpec: "Fixed",
    cellWidth: 40,
    timeHeaders: [{"groupBy":"Month"},{"groupBy":"Day","format":"d"}],
    scale: "Day",
    days: DayPilot.Date.today().daysInMonth(),
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    taskHeight: 35,
    rowHeaderHideIconEnabled: false,
    rowMoveHandling: "Update",
    onRowMoved: (args) => {
      //args.control.message("Row moved: " + args.source.text());
    },
    taskMoveHandling: "Update",
    onTaskMoved: (args) => {
      let start =args.newStart.getYear() + '-' + (args.newStart.getMonth() + 1 )+ '-' + args.newStart.getDay()+ ' ' + args.task.data['HoraInicio'];
      let end =  args.newEnd.getYear() + '-' + ( args.newEnd.getMonth() + 1 )+ '-' + args.newEnd.getDay() + ' ' + args.task.data['HoraFin'];
      let TaskId = args.task.data['taskId'];
      this.updateTask(TaskId,start,end);
      //args.control.message("Task moved to: " + args.newStart);
    },
    onTaskResized:(args) =>{
      let start =args.newStart.getYear() + '-' + (args.newStart.getMonth() + 1 )+ '-' + args.newStart.getDay()+ ' ' + args.task.data['HoraInicio'];
      let end =  args.newEnd.getYear() + '-' + ( args.newEnd.getMonth() + 1 )+ '-' + args.newEnd.getDay() + ' ' + args.task.data['HoraFin'];
      let TaskId = args.task.data['taskId'];
      //this.updateTask(TaskId,start,end);
    },
    linkCreateHandling: "Update",
    onLinkCreated: (args) => {
      //args.control.message("Link created, type: " + args.type);
    },
    rowCreateHandling: "Enabled",
    onRowCreate: (args) => {
      args.control.tasks.add(new DayPilot.Task({
        id: DayPilot.guid(),
        text: args.text,
        start: new DayPilot.Date().getDatePart(),
        end: new DayPilot.Date().getDatePart().addDays(1)
      }));
    },
  });
  

  ngOnInit() {
    this.subscribeToParentEmitter();
    this.dp.init();
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

  async LeerMiembros(){
    let data = await this.proyGanttService.LeerMiembros();
    this.Miembros = data['data'];
  }
  async leerTareas(){
    if(this.Tab_Id == '5'){
      this.loading = true;
      await this.LeerMiembros();
      let data = await this.proyGanttService.leerItems(this.Task_Id);
      this.Tareas = data['data'];
      let Grupos = [];
      for(let y=0;y<this.Miembros.length;y++){
        let g = {
          "id": this.Miembros[y]['Id_Persona'],
          "text": this.Miembros[y]['name'],
          "children":[],
          "row": {
            "collapsed": false
          },
          "start": "2024-04-04T00:00:00",
          "end": "2024-04-16T00:00:00",
        }
        let tareas = []
        for(let i = 0;i<this.Tareas.length;i++){
          for(let x =0;x<this.Tareas[i]['Miembros'].length;x++){
            
            if(this.Tareas[i]['Miembros'][x]['Id_Persona'] == this.Miembros[y]['Id_Persona']){
              let inicio = this.Tareas[i].start.split(' ');
              let fin = this.Tareas[i].end.split(' ');
              let m ={
                id: this.Tareas[i].Id+y,
                taskId: this.Tareas[i].Id,
                start: this.Tareas[i].start, 
                end: this.Tareas[i].end, 
                text: this.Tareas[i].name, 
                complete: 50,
                HoraInicio:inicio[1],
                HoraFin:fin[1]
              }
              tareas.push(m);
            }
          }
        }
        g.children = tareas;
        Grupos.push(g)
      }
      this.dp.tasks.list = Grupos;
      this.dp.update();
      this.loading = false;
    }
  }
  SelItem(Item){
    this.SeleccionarItem.emit(Item);
  }
  updateTask(taskId,Start,End){
    let data = this.proyGanttService.actualizarItem(taskId,Start,End);
  }
}

