import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CursoRoutingModule } from './curso-routing.module';

import { CursoVisorComponent } from './curso-visor/curso-visor.component';
import { SemanaDetalleComponent } from './semana-detalle/semana-detalle.component';
import { SemanaEstudioComponent } from './semana-estudio/semana-estudio.component';
import { RecursoVideoComponent } from './recurso-video/recurso-video.component';
import { RecursoTextoComponent } from './recurso-texto/recurso-texto.component';
import { RecursoEnlaceComponent } from './recurso-enlace/recurso-enlace.component';
import { RecursoPdfComponent } from './recurso-pdf/recurso-pdf.component';
import { RecursoPresentacionComponent } from './recurso-presentacion/recurso-presentacion.component';
import { ActividadAlumnoComponent } from './actividad-alumno/actividad-alumno.component';

@NgModule({
  imports: [
    CommonModule,
    CursoRoutingModule,
    FormsModule
  ],
  declarations: [CursoVisorComponent,SemanaDetalleComponent,SemanaEstudioComponent,RecursoVideoComponent,RecursoTextoComponent,
    RecursoEnlaceComponent,RecursoPdfComponent,RecursoPresentacionComponent,ActividadAlumnoComponent
  ]
})
export class CursosModule { }
