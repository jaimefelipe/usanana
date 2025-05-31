import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeriodoAcademicoComponent } from './periodo-academico/periodo-academico.component';
import { GrupoAcademicoComponent } from './grupo-academico/grupo-academico.component';
import { MatriculaComponent } from './matricula/matricula.component';
import { ReportesRegistroComponent } from './reportes-registro/reportes-registro.component';


const routes: Routes = [
  { path: 'periodo', component: PeriodoAcademicoComponent},
  { path: 'grupo', component: GrupoAcademicoComponent},
  { path: 'matricula', component: MatriculaComponent},
  { path: 'reportesacademicos', component: ReportesRegistroComponent},
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
