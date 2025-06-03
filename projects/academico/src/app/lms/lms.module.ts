import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LmsRoutingModule } from './lms-routing.module';
import { AulaVirtualComponent } from './aula-virtual/aula-virtual.component';
import { SemanaCursoComponent } from './semana-curso/semana-curso.component';
import { ActividadComponent } from './actividad/actividad.component';
import { RecursoComponent } from './recurso/recurso.component';
import { EntregasComponent } from './entregas/entregas.component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LmsRoutingModule
  ],
  declarations: [AulaVirtualComponent,SemanaCursoComponent,ActividadComponent,RecursoComponent,EntregasComponent]
})
export class LmsModule { }
