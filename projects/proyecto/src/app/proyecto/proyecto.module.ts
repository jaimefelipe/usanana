import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProyectoRoutingModule } from './proyecto-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 

import { TaskTreeComponent } from './task-tree/task-tree.component';
import { TaskKanbanComponent } from './task-kanban/task-kanban.component';
import { TaskGanttComponent } from './task-gantt/task-gantt.component';
import { TaskCalendarComponent } from './task-calendar/task-calendar.component';
import { ProyTaskComponent } from './proy-task/proy-task.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TaskListComponent } from './task-list/task-list.component';


import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';


import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { KanbanModule } from '@syncfusion/ej2-angular-kanban'
import { GanttModule } from '@syncfusion/ej2-angular-gantt'
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations'
import { SplitterModule } from '@syncfusion/ej2-angular-layouts';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor'

registerLocaleData(localeEs, 'es'); // Registra el idioma español

import 'zone.js';


@NgModule({
  declarations: [  
    TaskTreeComponent,
    TaskKanbanComponent,
    TaskGanttComponent,
    TaskCalendarComponent,
    ProyTaskComponent,
    TaskFormComponent,
    TaskListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    ProyectoRoutingModule,
    ScheduleModule,
    KanbanModule,
    GanttModule,
    TreeViewModule,
    SplitterModule,
    RichTextEditorAllModule
  ],
  exports: [TaskFormComponent,TaskKanbanComponent,TaskCalendarComponent] 
})
export class ProyectoModule { }
