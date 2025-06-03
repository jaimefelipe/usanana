import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlumnoRoutingModule } from './alumno-routing.module';
import { PrimerIngresoComponent } from './primer-ingreso/primer-ingreso.component';
import { ExpedienteAlumnoComponent } from './expediente-alumno/expediente-alumno.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AlumnoRoutingModule
  ],
  declarations: [PrimerIngresoComponent,ExpedienteAlumnoComponent]
})
export class AlumnoModule { }
