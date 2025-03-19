import { Component, OnInit, Input, SimpleChanges, EventEmitter, Output, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { CardSettingsModel, KanbanComponent, CardClickEventArgs } from '@syncfusion/ej2-angular-kanban';
import { TaskKanbanService } from './task-kanban.service';

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

    constructor(private taskKanbanService: TaskKanbanService) {}

    data = [];
    statusMap: { [key: string]: string } = {
        '1': 'Pendiente',
        '2': 'En Proceso',
        '3': 'Ajustes',
        '4': 'Visto Bueno',
        '5': 'Aprobado',
        '6': 'Terminado',
        '7': 'Bloqueada'
    };

    ngOnChanges(changes: SimpleChanges) {
        let Id_Proyecto = changes['ItemSelected']?.currentValue;
        if (Id_Proyecto) {
            this.leerTareas(Id_Proyecto);
        }
    }

    ngOnInit() {
        this.leerTareas(-1);
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
        }
    }

    async updateCardStatus(cardId: number, newStatus: string) {
        await this.taskKanbanService.updateProyectStatus(cardId, newStatus);
    }

    onCardClick(event: CardClickEventArgs) {
        this.TareaSeleccionadaEnKanban.emit(event.data['Id']);
    }
}
