import { Component,OnInit, Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
//import {DayPilot, DayPilotGanttComponent} from "daypilot-pro-angular";
import { ProySchedulerService } from '../proy-scheduler/proy-scheduler.service';
import { ProyGanttService } from '../proy-gantt/proy-gantt.service';
import { DayPilot } from '../../../assets/daypilot/daypilot-all.min';

@Component({
  selector: 'app-proy-week',
  templateUrl: './proy-week.component.html',
  styleUrls: ['./proy-week.component.css']
})
export class ProyWeekComponent implements OnInit {
  @Input() ItemSelected: EventEmitter<string>; 
  @Input() TabSelected: EventEmitter<string>; 
  
  constructor(
    private proySchedulerService:ProySchedulerService,
    private proyGanttService:ProyGanttService
  ) { }
  Task_Id = '';
  Tab_Id = '';
  loading = false;
  eventos = [];
  dp = new DayPilot.Calendar("dpW", {
    locale: "es-es",
    viewType: "Week",
    timeRangeSelectedHandling: "Enabled",
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Create a new event:", "Event 1");
      const dp = args.control;
      dp.clearSelection();
      if (modal.canceled) { return; }
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result
      });
    },
    eventMoveHandling: "Update",
    onEventMoved: (args) => {
      let start =args.newStart.getYear() + '-' + (args.newStart.getMonth() + 1 )+ '-' + args.newStart.getDay()+ ' ' + args.newStart.getHours() + ':' + args.newStart.getMinutes();
      let end =  args.newEnd.getYear() + '-' + ( args.newEnd.getMonth() + 1 )+ '-' + args.newEnd.getDay() + ' ' + args.newEnd.getHours() + ':' + args.newEnd.getMinutes();
      let TaskId = args.e.data['id'];
      this.updateTask(TaskId,start,end);


    },
    eventResizeHandling: "Update",
    onEventResized: (args) => {
      let start =args.newStart.getYear() + '-' + (args.newStart.getMonth() + 1 )+ '-' + args.newStart.getDay()+ ' ' + args.newStart.getHours() + ':' + args.newStart.getMinutes();
      let end =  args.newEnd.getYear() + '-' + ( args.newEnd.getMonth() + 1 )+ '-' + args.newEnd.getDay() + ' ' + args.newEnd.getHours() + ':' + args.newEnd.getMinutes();
      let TaskId = args.e.data['id'];
      this.updateTask(TaskId,start,end);
    },
    eventClickHandling: "Disabled",
    eventHoverHandling: "Disabled",
  });
  ngOnInit() {
    this.dp.init();
    this.subscribeToParentEmitter();
  }

  subscribeToParentEmitter(): void { 
    this.ItemSelected.subscribe((data: any) => { 
      this.Task_Id = data;
      this.leerEventos();
      
    }); 
    this.TabSelected.subscribe((data: any) => { 
        this.Tab_Id = data;
        this.leerEventos();
    });
  } 
  // Function to generate the calendar
  async leerEventos(inicio?,fin?){
    if(this.Tab_Id == '3'){
      this.loading = true;
      if(!inicio){
        inicio = '2024-04-01';
        fin = '2024-04-30';
      }
      let data = await this.proySchedulerService.leerActividades('',inicio,fin);
      if(data['total'] == 0 ){
        this.eventos = [];
      }else{
        this.eventos = data['data'];
      }
      for(let i=0;i<this.eventos.length;i++){
        let inicio = this.eventos[i].start.split(' ');
        let fin = this.eventos[i].end.split(' ');
              
        this.eventos[i]['HoraInicio'] = inicio[1];
        this.eventos[i]['HoraFin'] = fin[1];
      }
      this.dp.events.list = this.eventos;
      this.dp.update();
      this.loading = false;
    }
  }
  updateTask(taskId,Start,End){
    let data = this.proyGanttService.actualizarItem(taskId,Start,End);
  }

}
