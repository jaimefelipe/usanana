import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LmsRoutingModule } from './lms-routing.module';
import { AulaVirtualComponent } from './aula-virtual/aula-virtual.component';
import { SemanaCursoComponent } from './semana-curso/semana-curso.component';
import { EntregasComponent } from './entregas/entregas.component';
import { AulaVirtualGeneralComponent } from './aula-virtual-general/aula-virtual-general.component';
import { RecursoSemanaComponent } from './recurso-semana/recurso-semana.component';
import { ActividadSemanaComponent } from './actividad-semana/actividad-semana.component';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LmsRoutingModule,
    RichTextEditorModule,
     BrowserAnimationsModule,
    RichTextEditorAllModule,
  ],
  declarations: [AulaVirtualComponent,SemanaCursoComponent,EntregasComponent,AulaVirtualGeneralComponent,RecursoSemanaComponent,ActividadSemanaComponent]
})
export class LmsModule { }
