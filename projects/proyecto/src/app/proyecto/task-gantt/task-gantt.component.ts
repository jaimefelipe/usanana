import { Component, OnInit,Input,SimpleChanges,Output,EventEmitter} from '@angular/core';
import { RowDDService, EditService , FilterService, SortService, SelectionService, ToolbarService, DayMarkersService,EditSettingsModel  } from '@syncfusion/ej2-angular-gantt';
import { TaskKanbanService } from '../task-kanban/task-kanban.service';
import { TaskCalendarService } from '../task-calendar/task-calendar.service';
import { ToolbarItem } from '@syncfusion/ej2-angular-gantt';
import { Gantt, Edit } from '@syncfusion/ej2-gantt';

@Component({
  selector: 'app-task-gantt',
  templateUrl: './task-gantt.component.html',
  styleUrls: ['./task-gantt.component.css'],
  providers: [ EditService , FilterService, SortService, SelectionService, ToolbarService, DayMarkersService ,RowDDService]
})
export class TaskGanttComponent implements OnInit {
  @Input() ItemSelected: number;
  @Output() TareaSeleccionadaEnGantt = new EventEmitter<any>(); 
  public data?: object[];
  public taskSettings?: object;
  public editSettings?: EditSettingsModel;
  public splitterSettings?: object;
  public allowRowDragAndDrop: boolean = true;
  public allowTaskbarDragAndDrop: boolean = true;
  public toolbar?: ToolbarItem[];
  constructor(
    private taskKanbanService:TaskKanbanService,
    private taskCalendarService:TaskCalendarService
  ) {}
    ngOnChanges(changes: SimpleChanges) {
        let Id_Proyecto = changes['ItemSelected']?.currentValue;
        if (Id_Proyecto) {
           this.leerTareas(Id_Proyecto);
        }
    }
    
  ngOnInit() {
    this.leerTareas(-1);
    this.taskSettings = {
        id: 'Id',
        name: 'Subject',
        startDate: 'StartTime',
        endDate: 'EndTime',
        progress: 'Progreso',
        dependency: 'Predecesor'
        //duration: 'Duration',
        //progress: 'Progress',
        //dependency: 'Predecessor',
        //child: 'subtasks'
    };
    this.toolbar =  ['ZoomIn', 'ZoomOut', 'ZoomToFit'];
    this.editSettings = {
      allowEditing: true,
      allowTaskbarEditing: true,
      mode:"Auto"
    };
    this.splitterSettings = {
      position: '20%'
    };
  }
  async leerTareas(Id_Proyecto: number) {
    let response = await this.taskKanbanService.leerProyectosHijos(Id_Proyecto);
    this.data = response?.success === 'true' ? response.data : [];

  }
  async onActionComplete(event: any) {
  
    if (event.requestType === "save") {
      let Inicio = this.formatDateToMySQL(event.data.StartTime);
      let Fin = this.formatDateToMySQL(event.data.EndTime);
      let Id = event.data.Id;
      let Progreso = event.data.Progreso;
      let Predecesor =  event.data.Predecesor;
      await this.taskCalendarService.updateProyectStatus(Id,Inicio,Fin,Progreso,Predecesor);
    } 
    if(event.requestType === "DrawConnectorLine"){
      console.log(event.data)
    }
    
  }
  onActionBegin(event){
    if(event.requestType === "beforeOpenEditDialog"){
      if(event.rowData.Id){
        this.TareaSeleccionadaEnGantt.emit(event.rowData.Id);
      }
      event.cancel = true;
    }
  }
  formatDateToMySQL(date: Date): string {
    const pad = (num: number) => (num < 10 ? '0' + num : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
          `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }
}
