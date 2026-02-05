import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { GrupoProfesorComponent } from './grupo-profesor/grupo-profesor.component';
import { PrimerIngresoComponent } from './primer-ingreso/primer-ingreso.component';
import { ExpedienteAlumnoComponent } from './expediente-alumno/expediente-alumno.component';
import { AcademicoAuthGuard } from '../core/guards/academico-auth.guard';

const routes: Routes = [
  { path: 'primeringreso', component: PrimerIngresoComponent},
  { path: 'expedientealumno', component: ExpedienteAlumnoComponent, canActivate: [AcademicoAuthGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnoRoutingModule { }
