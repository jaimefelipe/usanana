import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { CardSettingsModel, KanbanComponent, CardClickEventArgs } from '@syncfusion/ej2-angular-kanban';
import { TaskKanbanService } from './task-kanban.service';
import { TaskFormService } from '../task-form/task-form.service';

@Component({
  selector: 'app-task-kanban',
  templateUrl: './task-kanban.component.html',
  styleUrls: ['./task-kanban.component.css']
})
export class TaskKanbanComponent implements OnInit, AfterViewInit {
    @ViewChild('kanbanObj') kanbanObj!: KanbanComponent;
    @ViewChild('cardTemplate', { static: false }) cardTemplate!: TemplateRef<any>;

    @Input() ItemSelected: number;
    @Output() TareaSeleccionadaEnKanban = new EventEmitter<any>();   
    @Input() recargar: EventEmitter<void>; 

    constructor(
        private taskKanbanService: TaskKanbanService,
        private taskFormService:TaskFormService
    ) {}
    hoy = new Date();
    FechaHoy = this.hoy.getDate() + '-'+  this.hoy.getMonth() + 1 + "-"+ this.hoy.getFullYear();
    data = [];
    statusMap: { [key: string]: string } = {
        '1': 'Pendiente',
        '2': 'En Proceso',
        '3': 'Ajustes',
        '4': 'Visto Bueno',
        '7': 'Terceros',
        '5': 'Aprobado',
        '6': 'Terminado'
    };

    Seguimiento = '';
    ngOnChanges(changes: SimpleChanges) {
        let Id_Proyecto = changes['ItemSelected']?.currentValue;
        if (Id_Proyecto) {
            this.leerTareas(Id_Proyecto);
        }
    }

    ngOnInit() {
        this.leerTareas(-1);
        if (this.recargar) {
          this.recargar.subscribe(() => {
            //this.cargarDatosKanban();
            this.leerTareas(-1);
          });
        }
    }
    isExpired(fecha: string | Date): boolean {
        if (!fecha) return false;
        
        let fechaPlanificada = new Date(fecha);
        let hoy = new Date();
    
        // Elimina la hora para comparar solo la fecha
        hoy.setHours(0, 0, 0, 0);
        fechaPlanificada.setHours(0, 0, 0, 0);
    
        return fechaPlanificada < hoy;
    }
    ngAfterViewInit() {
      // Convierte el TemplateRef en una función compatible con Syncfusion
      this.cardSettings.template = () => this.cardTemplate;
  }

    public cardSettings: CardSettingsModel = {
        contentField: 'Summary',
        headerField: 'Id',
        template: null  // Se asignará en ngAfterViewInit()
    };

    async leerTareas(Id_Proyecto: number) {
        let response = await this.taskKanbanService.leerProyectosHijos(Id_Proyecto);
        this.data = response?.success === 'true' ? response.data : [];
    }

    onActionComplete(event: any) {
        if (event.requestType === 'cardChanged') {
            const updatedCard = event.changedRecords[0]; // Tarjeta movida
            this.updateCardStatus(updatedCard.Id, updatedCard.Status);
            //Cambiar Fechas reales en estado de las tareas;
        }
    }
    async agregarSeguimieto(Id_Proyecto){
    let Seguimiento = {
        Id_Proyecto:Id_Proyecto,
        Id_Persona:localStorage.getItem('Id_Usuario'),
        Fecha:this.FechaHoy,
        Nombre:localStorage.getItem('Nombre_Usuario').substring(0,2),
        Nota:this.Seguimiento
    }
    this.Seguimiento = '';
    await this.taskFormService.nuevaNota(Seguimiento);
    }

    async updateCardStatus(cardId: number, newStatus: string) {
        await this.taskKanbanService.updateProyectStatus(cardId, newStatus);
        //Agregar Actividad
        let Estado = '';
    switch (newStatus) {
      case "1":
        Estado = 'Pendiente';
        break;
      case "2":
        Estado = 'En Proceso';
        break;
      case "3":
        Estado = 'Ajustes';
        break;
      case "4":
        Estado = 'Visto Bueno';
        break;
      case "5":
        Estado = 'Aprobado';
        break;
      case "6":
        Estado = 'Terminado';
        break;
      case "7":
        Estado = 'Terceros';
        break;
    }
    this.Seguimiento = 'Actividad cambia estado a '+Estado;
    this.agregarSeguimieto(cardId);

    }

    onCardClick(event: CardClickEventArgs) {
        this.TareaSeleccionadaEnKanban.emit(event.data['Id']);
    }
}
