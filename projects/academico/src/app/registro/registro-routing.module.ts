import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeriodoAcademicoComponent } from './periodo-academico/periodo-academico.component';
import { GrupoAcademicoComponent } from './grupo-academico/grupo-academico.component';
import { MatriculaComponent } from './matricula/matricula.component';
import { ReportesRegistroComponent } from './reportes-registro/reportes-registro.component';
import { AcademicoAuthGuard } from '../core/guards/academico-auth.guard';


const routes: Routes = [
  { path: 'periodo', component: PeriodoAcademicoComponent, canActivate: [AcademicoAuthGuard]},
  { path: 'grupo', component: GrupoAcademicoComponent, canActivate: [AcademicoAuthGuard]},
  { path: 'matricula', component: MatriculaComponent, canActivate: [AcademicoAuthGuard]},
  { path: 'reportesacademicos', component: ReportesRegistroComponent, canActivate: [AcademicoAuthGuard]},
  
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegistroRoutingModule { }
