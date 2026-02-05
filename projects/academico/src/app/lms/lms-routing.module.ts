import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaVirtualComponent } from './aula-virtual/aula-virtual.component';
import { SemanaCursoComponent } from './semana-curso/semana-curso.component';
import { EntregasComponent } from './entregas/entregas.component';
import { AcademicoAuthGuard } from '../core/guards/academico-auth.guard';

const routes: Routes = [
  { path: 'aulavirtual', component: AulaVirtualComponent, canActivate: [AcademicoAuthGuard]},
  { path: 'semanacurso', component: SemanaCursoComponent, canActivate: [AcademicoAuthGuard]},
  { path: 'entregas', component: EntregasComponent, canActivate: [AcademicoAuthGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
