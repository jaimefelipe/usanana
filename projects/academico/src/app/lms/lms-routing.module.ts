import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaVirtualComponent } from './aula-virtual/aula-virtual.component';
import { SemanaCursoComponent } from './semana-curso/semana-curso.component';
import { EntregasComponent } from './entregas/entregas.component';

const routes: Routes = [
  { path: 'aulavirtual', component: AulaVirtualComponent},
  { path: 'semanacurso', component: SemanaCursoComponent},
  { path: 'entregas', component: EntregasComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LmsRoutingModule { }
