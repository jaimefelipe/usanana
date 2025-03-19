import { Component, OnInit, SimpleChanges, Input,ViewChild,Output,EventEmitter } from '@angular/core';
import { WeekService, MonthService, WorkWeekService, DayService, AgendaService,MonthAgendaService,YearService,TimelineMonthService,DragAndDropService,ResizeService  } from '@syncfusion/ej2-angular-schedule';
import { ScheduleComponent, EventSettingsModel, WorkHoursModel,PopupOpenEventArgs,GroupModel  } from '@syncfusion/ej2-angular-schedule';
import { TaskKanbanService } from '../task-kanban/task-kanban.service';
import { TaskCalendarService } from './task-calendar.service';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.css'],
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService,MonthAgendaService,YearService,TimelineMonthService,DragAndDropService,ResizeService],
})
export class TaskCalendarComponent implements OnInit {
  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent; // Referencia al calendario
  @Output() TareaSeleccionadaEnCalendar = new EventEmitter<any>();  
  @Input() ItemSelected: number;
  constructor(
    private taskKanbanService:TaskKanbanService,
    private taskCalendarService:TaskCalendarService
  ) { }
  
  data: object [] = [];
  public startHour = '08:00';
  public endHour = '18:00';
  public workHours: WorkHoursModel = { start: '08:00' };
  public groupSettings: GroupModel = { resources: ['Owners'] };
   
  public ownerDataSource: Object[] = [
    { OwnerText: 'Desarrollo', Id: 'Desarrollo', OwnerColor: '#ffaa00' },
    { OwnerText: 'Steven', Id: 2, OwnerColor: '#f8a398' },
    { OwnerText: 'Michael', Id: 3, OwnerColor: '#7499e1' }
];

  ngOnInit() {
    this.leerResponsables();
    this.leerTareas(-1)
    
    this.eventSettings = {
      dataSource: this.data
    };
  }
  ngOnChanges(changes: SimpleChanges) {
      let Id_Proyecto = changes['ItemSelected']?.currentValue;
      if (Id_Proyecto) {
         this.leerTareas(Id_Proyecto);
      }
  }
  
  public onPopupOpen(args: PopupOpenEventArgs): void {
    args.cancel = true;
    /*
    if ((args.target && !args.target.classList.contains('e-appointment') && (args.type === 'QuickInfo')) || (args.type === 'Editor')) {
      args.cancel = this.onEventCheck(args);
    }*/
  }

  public eventSettings: EventSettingsModel = {
    dataSource: this.data
  }
  async leerResponsables(){
    let data = await this.taskCalendarService.GetResponsables();
    if (data['total'] > 0) {
      this.ownerDataSource = data['data'];
    }else{
      //this.data = []
    }
  }
  async leerTareas(Id_Proyecto: number) {
    let data = await this.taskKanbanService.leerProyectosHijos(Id_Proyecto);
    if (data['total'] > 0) {
      this.data = data['data'];
    }else{
      this.data = []
    }

    this.eventSettings = {
      dataSource: this.data
    };
  }
  async handleDragStop(event) {
    let Inicio = this.formatDateToMySQL(event.data.StartTime);
    let Fin = this.formatDateToMySQL(event.data.EndTime);
    let Id = event.data.Id_Proyecto
    let Progreso = event.data.Progreso
    let Predecesor = event.data.Predecesor
    await this.taskCalendarService.updateProyectStatus(Id,Inicio,Fin,Progreso,Predecesor);
    
  }
  // ✅ Función para convertir Date a formato DATETIME MySQL
  formatDateToMySQL(date: Date): string {
    const pad = (num: number) => (num < 10 ? '0' + num : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
          `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
  onEventClick(event){
    event.cancel = true; 
    if(event.event.Id_Proyecto){
      this.TareaSeleccionadaEnCalendar.emit(event.event.Id_Proyecto);
    }
  }

}
