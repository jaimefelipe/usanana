import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProyectoRoutingModule } from './proyecto-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; 
import { jqxTreeModule } from 'jqwidgets-ng/jqxtree';
import { jqxExpanderModule } from 'jqwidgets-ng/jqxexpander';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { ProyectoComponent } from './proyecto/proyecto.component';
import { ProyTreeComponent } from './proy-tree/proy-tree.component';
import { ProyActividadComponent } from './proy-actividad/proy-actividad.component';
import { ProySchedulerComponent } from './proy-scheduler/proy-scheduler.component';
import { ProyWeekComponent } from './proy-week/proy-week.component';
import { ProyTableroComponent } from './proy-tablero/proy-tablero.component';
import { ProyGanttComponent } from './proy-gantt/proy-gantt.component';
import { NgxGanttModule } from '@worktile/gantt';
import {TranslateModule} from '@ngx-translate/core';
import {DayPilotModule} from "daypilot-pro-angular";

@NgModule({
  declarations: [ProyTreeComponent, ProyectoComponent, ProyActividadComponent, ProySchedulerComponent,ProyTableroComponent,ProyGanttComponent,ProyWeekComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    NgbModule,
    ProyectoRoutingModule,
    jqxTreeModule, 
    jqxExpanderModule,
    BrowserAnimationsModule,
    NgxGanttModule,
    DayPilotModule,
    TranslateModule.forRoot({
      defaultLanguage: 'es'
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    
  ],
  bootstrap: [ProyTreeComponent]
})
export class ProyectoModule { }
